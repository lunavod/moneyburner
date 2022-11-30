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

import { CurrenciesService } from './currencies.service'
import { CreateCurrencyDto } from './dto/create-currency.dto'
import { UpdateCurrencyDto } from './dto/update-currency.dto'

@Controller()
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto, @GetUser() user: User) {
    return this.currenciesService.create({
      ...createCurrencyDto,
      userId: user.id,
    })
  }

  @Get()
  findAll() {
    return this.currenciesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currenciesService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    return this.currenciesService.update(id, updateCurrencyDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currenciesService.remove(id)
  }
}
