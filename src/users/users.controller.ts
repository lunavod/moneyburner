import {
  Controller,
  Get,
  Param,
  Delete,
  Patch,
  Body,
  Post,
  HttpException,
  UsePipes,
  ValidationPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import { Public } from 'src/auth/public.decorator'
import { isUuid } from 'src/utils/isUuid'

import { CreateUserDto } from './dto/create.dto'
import { UpdateUserDto } from './dto/update.dto'
import { UserEntity } from './entities/user.entity'
import { UsersService } from './users.service'

@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isUuid(id)) throw new HttpException('Not found', 404)
    return this.usersService.findOne(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!isUuid(id)) throw new HttpException('Not found', 404)
    return this.usersService.remove(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    if (!isUuid(id)) throw new HttpException('Not found', 404)
    return this.usersService.update(id, data)
  }

  @Public({ only: true })
  @Post()
  @UsePipes(ValidationPipe)
  async register(@Body() data: CreateUserDto) {
    return plainToInstance(UserEntity, await this.usersService.register(data))
  }
}
