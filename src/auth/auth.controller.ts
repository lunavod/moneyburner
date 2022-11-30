import {
  Controller,
  Get,
  Request,
  Post,
  Query,
  HttpException,
  HttpStatus,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UsersService } from 'src/users/users.service'

import { AuthService } from './auth.service'
import { Public } from './public.decorator'

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Public({ only: true })
  @Post('login')
  async login(
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    const user = await this.auth.validateUser(username, password)
    if (!user) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)

    return this.auth.login(user)
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }

  @Public({ only: true })
  @Post('password-reset')
  async requestReset(@Query('email') email: string) {
    const user = await this.users.findByEmail(email)
    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND)

    const hash = await this.users.setPasswordResetHash(user.id)
    return hash
  }

  @Public({ only: true })
  @Post('password-reset/:hash')
  async reset(@Param('hash') hash: string, @Query('newPassword') pwd: string) {
    const user = await this.users.findByPasswordResetHash(hash)
    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND)

    await this.users.resetPasswordResetHash(user.id)
    await this.users.update(user.id, { password: pwd })
    return true
  }
}
