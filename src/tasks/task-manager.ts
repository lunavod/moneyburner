/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, Logger, Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Task, TaskRun } from '@prisma/client'
import { ClickHouseLogger } from 'src/utils/clickhouse.logger'

const tasks: Record<string, Function> = {}

export const TaskRunner = (name: string) => {
  return (constructor: Function) => {
    tasks[name] = constructor
  }
}

@Injectable()
export class TaskManager {
  private readonly logger = new Logger(TaskManager.name)
  constructor(private moduleRef: ModuleRef) {}

  async runTask(task: Task, run: TaskRun, logger: ClickHouseLogger) {
    let instance
    if (!(task.name in tasks)) {
      this.logger.warn(`Task ${task.name} not found`)
      return
    }
    try {
      instance = await this.moduleRef.create(
        tasks[task.name] as unknown as Type<any>,
      )
    } catch (err) {
      this.logger.error('Error while creating task', task.name)
    }

    const arr = [instance.main(task, run, logger)]
    if (!task.isBig)
      arr.push(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(null)
          }, 20000)
        }),
      )
    await Promise.race(arr)
  }
}
