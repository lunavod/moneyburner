import { Module } from '@nestjs/common'
import { AccountsModule } from 'src/accounts/accounts.module'

import { PurchasesController } from './purchases.controller'
import { PurchasesService } from './purchases.service'

@Module({
  imports: [AccountsModule],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
