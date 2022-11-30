import { Module } from '@nestjs/common'

import { LeumiService } from './leumi.service'

@Module({
  providers: [LeumiService],
  exports: [LeumiService],
})
export class LeumiModule {}
