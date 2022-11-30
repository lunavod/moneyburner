/* eslint-disable no-console */
import { ClickHouseClient } from '@depyronick/nestjs-clickhouse'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { Task, TaskRun } from '@prisma/client'
// import chalkTemplate from 'chalk-template'
import { DateTime } from 'luxon'
// import stripAnsi from 'strip-ansi'
import { v4 } from 'uuid'

const util = require('util')

@Injectable()
export class TaskLogger {
  @Inject('CLICKHOUSE')
  private client: ClickHouseClient

  create(task: Task, run: TaskRun) {
    return new ClickHouseLogger(this.client, task, run)
  }
}

export class ClickHouseLogger implements LoggerService {
  private interval

  constructor(
    private client: ClickHouseClient,
    private task: Task,
    private run: TaskRun,
  ) {
    this.interval = setInterval(() => {
      if (process.env.NODE_ENV !== 'test') this.sendMessages()
    }, 1000)
  }

  stop() {
    clearInterval(this.interval)
  }

  private messages = []

  sendMessages() {
    if (!this.messages.length) return
    this.messages = []
    return
  }

  private write(message: any, level: string) {
    if (
      process.env.NODE_ENV === 'test' &&
      level !== 'warn' &&
      level !== 'error'
    )
      return
    if (typeof message !== 'string') {
      message = util.inspect(message, {
        showHidden: false,
        depth: null,
        colors: true,
      })
    }

    this.messages.push({
      Id: v4(),
      TaskRunId: this.run.id,
      Type: level,
      Text: message,
      Time: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss.SSS'),
    })

    const prefix = `{blue [${this.task.name}] - }${DateTime.now().toFormat(
      'dd.MM.yyyy HH:mm:ss.SSS',
    )} {blue :)} `
    if (level !== 'debug') {
      const msg = message.split('\n').join('\n'.padEnd(prefix.length + 1, ' '))
      console.log(prefix + msg)
    }
  }

  log(message: any) {
    this.write(message, 'info')
  }

  error(message: any) {
    this.write(message, 'error')
  }

  warn(message: any) {
    this.write(message, 'warn')
  }

  debug?(message: any) {
    this.write(message, 'debug')
  }

  verbose?(message: any) {
    this.write(message, 'verbose')
  }
}
