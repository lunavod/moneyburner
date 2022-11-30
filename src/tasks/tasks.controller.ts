import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { asyncMap } from 'src/tools'

import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name)

  constructor(private tasks: TasksService) {}

  @Post('run')
  async run(
    @Body('name') name: string,
    @Body('data') data: any,
    @Query('secretWord') secretWord: string,
    @Body('runNow') runNow?: boolean,
    @Body('isBig') isBig?: boolean,
  ) {
    if (secretWord !== process.env.TRIGGER_SECRET_WORD) {
      this.logger.error('PERMISSION DENIED')
      return new HttpException('PERMISSION DENIED', 403)
    }

    if (typeof data === 'string') data = JSON.parse(data)

    this.logger.log(
      `Task "${name}" registered with data ${JSON.stringify(data)}`,
    )
    const task = await this.tasks.register(
      name,
      data,
      null,
      null,
      null,
      !!isBig,
    )
    if (runNow) await this.tasks.runTask(task)
    return task
  }

  @Get('runs/:id/logs')
  async runLogs(@Param('id') id: string) {
    return this.tasks.findLogs(id)
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.tasks.findOne(id)
  }

  @Get(':id/logs')
  async logs(@Param('id') id: string) {
    const task = await this.tasks.findOne(id)
    const runs = await asyncMap(task.runs, async (run) => {
      return {
        run,
        logs: await this.tasks.findLogs(run.id),
      }
    })
    return runs
  }

  @Get()
  async list(
    @Query('limit', ParseIntPipe) limit = 20,
    @Query('offset', ParseIntPipe) offset = 0,
    @Query('name') name?: string,
    @Query('mainOnly', ParseBoolPipe) mainOnly = false,
  ) {
    const search: Prisma.TaskWhereInput = {}
    if (name?.length) search.name = name
    if (mainOnly) search.parentId = null
    return this.tasks.find(limit, offset, search)
  }
}
