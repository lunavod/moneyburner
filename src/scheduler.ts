import { INestApplication } from '@nestjs/common'

import { TasksService } from './tasks/tasks.service'

const schedule = require('node-schedule')

export async function scheduleTasks(app: INestApplication) {
  schedule.scheduleJob('*/90 * * * *', async () => {
    const tasks = app.get<TasksService>(TasksService)
    const task = await tasks.register('parseLeumi', {}, null, null, null, true)
    await tasks.runTask(task)
  })
}
