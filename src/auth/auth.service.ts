import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.users.findByUsername(username)
    if (user && this.users.checkPassword(pass, user.passwordHash)) {
      return user
    }
    return null
  }

  async login(user: any) {
    const payload = { authId: user.authId }
    return {
      access_token: this.jwt.sign(payload),
    }
  }
}
