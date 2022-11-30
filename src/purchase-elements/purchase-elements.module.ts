import { Module } from '@nestjs/common'

import { PurchaseElementsController } from './purchase-elements.controller'
import { PurchaseElementsService } from './purchase-elements.service'

@Module({
  controllers: [PurchaseElementsController],
  providers: [PurchaseElementsService],
})
export class PurchaseElementsModule {}
