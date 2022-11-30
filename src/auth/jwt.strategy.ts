import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { plainToInstance } from 'class-transformer'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserEntity } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject() users: UsersService

  constructor() {
    super({
      jwtFromRequest: (msg) => {
        // console.log(msg.headers)
        return msg.headers.authorization
      },
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET,
    })
  }

  async validate(payload: any) {
    // console.log(payload)
    const user = await plainToInstance(
      UserEntity,
      this.users.findByAuthId(payload.authId),
    )
    // console.log(user)
    return user
  }
}
