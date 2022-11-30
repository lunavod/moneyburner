import { ClickHouseModule } from '@depyronick/nestjs-clickhouse'
import { forwardRef, Module } from '@nestjs/common'
import { LeumiModule } from 'src/leumi/leumi.module'
import { UsersModule } from 'src/users/users.module'
import { TaskLogger } from 'src/utils/clickhouse.logger'

import { ParseLeumi } from './regular/parseLeumi.task'
import { TaskManager } from './task-manager'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'
import { TestTask } from './test.task'

// insert new imports here

require('dotenv').config()

const chConfig: Record<string, any> = {
  name: 'CLICKHOUSE',
  host: process.env.CH_HOST ?? '127.0.0.1',
  port: process.env.CH_PORT ? parseInt(process.env.CH_PORT) : 8123,
  database: process.env.CH_DATABASE,
}

if (process.env.CH_USERNAME) {
  chConfig.username = process.env.CH_USERNAME
  chConfig.password = process.env.CH_PASSWORD
}

@Module({
  imports: [UsersModule, ClickHouseModule.register([chConfig]), LeumiModule],
  providers: [
    TasksService,
    TestTask,
    TaskManager,
    TaskLogger,
    ParseLeumi,
    // insert new tasks here
  ],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
