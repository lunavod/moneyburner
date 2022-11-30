import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { GetUser } from 'src/auth/user.decorator'

import { CreateMoneyTransferDto } from './dto/create-money-transfer.dto'
import { UpdateMoneyTransferDto } from './dto/update-money-transfer.dto'
import { MoneyTransfersService } from './money-transfers.service'

@Controller()
export class MoneyTransfersController {
  constructor(private readonly moneyTransfersService: MoneyTransfersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createMoneyTransferDto: CreateMoneyTransferDto,
    @GetUser() user: User,
  ) {
    return this.moneyTransfersService.create({
      ...createMoneyTransferDto,
      userId: user.id,
    })
  }

  @Get()
  findAll() {
    return this.moneyTransfersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moneyTransfersService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMoneyTransferDto: UpdateMoneyTransferDto,
  ) {
    return this.moneyTransfersService.update(id, updateMoneyTransferDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moneyTransfersService.remove(id)
  }
}
