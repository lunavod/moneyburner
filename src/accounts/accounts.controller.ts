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

import { AccountsService } from './accounts.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto, @GetUser() user: User) {
    return this.accountsService.create({ ...createAccountDto, userId: user.id })
  }

  @Get()
  findAll() {
    return this.accountsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto)
  }

  @Post(':id/recalc')
  recalc(@Param('id') id: string) {
    return this.accountsService.recalculateBalance(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id)
  }
}
