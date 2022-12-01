import { Module } from '@nestjs/common'
import { AccountsModule } from 'src/accounts/accounts.module'

import { MoneyTransfersController } from './money-transfers.controller'
import { MoneyTransfersService } from './money-transfers.service'

@Module({
  imports: [AccountsModule],
  controllers: [MoneyTransfersController],
  providers: [MoneyTransfersService],
})
export class MoneyTransfersModule {}
