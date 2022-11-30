import { Module } from '@nestjs/common'

import { MoneyTransfersController } from './money-transfers.controller'
import { MoneyTransfersService } from './money-transfers.service'

@Module({
  controllers: [MoneyTransfersController],
  providers: [MoneyTransfersService],
})
export class MoneyTransfersModule {}
