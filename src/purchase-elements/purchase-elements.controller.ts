import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from 'src/auth/user.decorator'

import { CreatePurchaseElementDto } from './dto/create-purchase-element.dto'
import { UpdatePurchaseElementDto } from './dto/update-purchase-element.dto'
import { PurchaseElementsService } from './purchase-elements.service'

@Controller()
export class PurchaseElementsController {
  constructor(
    private readonly purchaseElementsService: PurchaseElementsService,
  ) {}

  @Post()
  create(
    @Body() createPurchaseElementDto: CreatePurchaseElementDto,
    @GetUser() user: User,
  ) {
    return this.purchaseElementsService.create({
      ...createPurchaseElementDto,
      userId: user.id,
    })
  }

  @Get()
  findAll() {
    return this.purchaseElementsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseElementsService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseElementDto: UpdatePurchaseElementDto,
  ) {
    return this.purchaseElementsService.update(id, updatePurchaseElementDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseElementsService.remove(id)
  }
}
