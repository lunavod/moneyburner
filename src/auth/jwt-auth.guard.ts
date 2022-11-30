import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { IS_PUBLIC_KEY } from './public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<
      { only: boolean } | undefined
    >(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])

    // console.log(isPublic)

    if (isPublic && !isPublic?.only) {
      return true
    }

    let err
    let result

    try {
      result = await super.canActivate(context)
    } catch (error) {
      err = error
      // console.log(err, result)
      if (isPublic) {
        return true
      }
    }

    // console.log(err, result)

    if (err) throw err
    if (result && isPublic) return false
    return result
  }
}
