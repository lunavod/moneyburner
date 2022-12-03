import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { GetUser } from 'src/auth/user.decorator'

import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { UpdatePurchaseDto } from './dto/update-purchase.dto'
import { PurchasesService } from './purchases.service'

@Controller()
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto, @GetUser() user: User) {
    return this.purchasesService.create({
      ...createPurchaseDto,
      userId: user.id,
    })
  }

  @Get()
  findAll(@Query('storeId') storeId?: string) {
    if (storeId) return this.purchasesService.findByStore(storeId)
    return this.purchasesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchasesService.update(id, updatePurchaseDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(id)
  }
}
