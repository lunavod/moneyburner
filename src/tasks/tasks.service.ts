import { ClickHouseClient } from '@depyronick/nestjs-clickhouse'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { TaskRun, Task, Prisma } from '@prisma/client'
import { isEqual } from 'lodash'
import { DateTime } from 'luxon'
import { PrismaService } from 'src/prisma.service'
import { TaskLogger } from 'src/utils/clickhouse.logger'
import { v4 } from 'uuid'

import { TaskManager } from './task-manager'

const Sentry = require('@sentry/node')

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private taskManager: TaskManager,
    private taskLogger: TaskLogger,
    @Inject('CLICKHOUSE')
    private clickhouse: ClickHouseClient,
  ) {}

  private readonly logger = new Logger(TasksService.name)

  async findLogs(runId: string) {
    const data = await new Promise((resolve) => {
      const events = []
      this.clickhouse
        .query(`SELECT * FROM task_run_logs WHERE TaskRunId = '${runId}'`)
        .subscribe({
          next: (e) => events.push(e),
          complete: () => resolve(events),
        })
    })
    return data
  }

  async find(
    limit: number,
    offset: number,
    search?: Prisma.TaskWhereInput,
  ): Promise<Task[]> {
    return this.prisma.task.findMany({
      take: limit,
      skip: offset,
      orderBy: { updatedAt: 'desc' },
      include: {
        runs: {
          include: {
            subtasks: {
              include: {
                runs: true,
              },
            },
          },
        },
      },
      where: search,
    })
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: { runs: true },
    })
  }

  async findPending(isBig = false) {
    const pendingTasks = await this.prisma.$queryRaw<
      Task[]
      // eslint-disable-next-line max-len
    >`SELECT * FROM "Task" WHERE status IN ('CREATED', 'ERROR') AND retries < 5 AND (retries = 0 OR "createdAt" > current_timestamp - interval '1 hour') AND "isBig"=${isBig} ORDER BY "createdAt" ASC LIMIT 100`
    return pendingTasks
  }

  async register(
    name: string,
    data: any,
    parent?: Task,
    parentRun?: TaskRun,
    eventId?: string,
    isBig?: boolean,
  ) {
    const taskData: Prisma.TaskUncheckedCreateInput = { name, data, eventId }
    if (parent) {
      taskData.parentId = parent.id
      taskData.isBig = isBig !== undefined ? isBig : parent.isBig
    } else {
      taskData.isBig = !!isBig
    }

    if (parentRun) taskData.parentRunId = parentRun.id

    const pending = await this.findPending(isBig)

    const existing = pending.find(
      (p) => p.name === name && isEqual(p.data, data),
    )
    if (existing) {
      this.logger.log(
        `Task ${name}${
          taskData.isBig ? ' (big)' : ''
        } with data ${JSON.stringify(data)} already exists (${existing.id})`,
      )
      return existing
    }

    return this.prisma.task.create({ data: taskData })
  }

  async simpleRun(taskInfo: { name: string; data: any }) {
    const task = taskInfo as Task
    task.id = v4()

    const run = {
      id: v4(),
      taskId: task.id,
      status: 'running',
      createdAt: new Date(),
      updatedAt: new Date(),
      finishedAt: new Date(),
    } as TaskRun
    const logger = this.taskLogger.create(task, run)

    await this.taskManager.runTask(task, run, logger)

    logger.stop()
  }

  async runTask(task: Task) {
    let transaction
    if (process.env.SENTRY_DSN) {
      transaction = Sentry.startTransaction({
        op: `task-${task.name}`,
        name: `Task ${task.name}`,
      })

      Sentry.setContext('task', {
        data: task.data,
      })

      Sentry.configureScope((scope) => {
        scope.setSpan(transaction)
      })
    }
    task = await this.prisma.task.findUnique({
      where: { id: task.id },
      include: { runs: true },
    })

    let run = await this.prisma.taskRun.create({
      data: {
        taskId: task.id,
        status: 'running',
      },
    })

    task.status = 'RUNNING'
    task.retries += 1
    await this.prisma.task.update({
      where: { id: task.id },
      data: { status: task.status, retries: task.retries },
    })

    const logger = this.taskLogger.create(task, run)

    const startedAt = DateTime.now().toSeconds()

    try {
      this.logger.log(
        `Running ${task.isBig ? 'BIG' : 'small'} task ${
          task.name
        } ${JSON.stringify(task.data)}`,
      )
      await this.taskManager.runTask(task, run, logger)
      logger.stop()
      run.status = 'done'
      task.status = 'SUCCESS'
    } catch (err) {
      logger.error(err)
      this.logger.error(err)
      Sentry.captureException(err)
      task.status = 'ERROR'
      run.status = 'error'
    } finally {
      run.finishedAt = new Date()
      run = await this.prisma.taskRun.update({
        where: { id: run.id },
        data: { status: run.status, finishedAt: run.finishedAt },
      })
      task = await this.prisma.task.update({
        where: { id: task.id },
        data: { status: task.status, retries: task.retries },
      })
    }

    const finishedAt = DateTime.now().toSeconds()
    this.logger.log(`Task finished, ${Math.round(finishedAt - startedAt)}s`)

    if (transaction) {
      transaction.finish()
    }

    return run.status === 'done'
  }

  async runSubtask(name: string, data: any, parent: Task, parentRun: TaskRun) {
    return this.runTask(await this.register(name, data, parent, parentRun))
  }

  async runQueue() {
    const runFirstTask = async () => {
      const tasks = await this.findPending()
      if (!tasks.length) {
        // eslint-disable-next-line no-console
        console.log('No tasks, waiting...')
        setTimeout(() => runFirstTask(), 5000)
        return
      }
      try {
        await this.runTask(tasks[0])
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
      runFirstTask().catch(this.logger.error)
    }
    return runFirstTask()
  }
}
