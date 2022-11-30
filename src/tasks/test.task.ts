import { Logger } from '@nestjs/common'

import { TaskRunner } from './task-manager'

@TaskRunner('testTask')
export class TestTask {
  private readonly logger = new Logger(TestTask.name)
  n = 0

  async main() {
    this.n++
    this.logger.log(this.n)
    if (Math.random() < 0.5) throw new Error('Ha, random error!')
  }
}
