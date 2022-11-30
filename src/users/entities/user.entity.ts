import { Exclude } from 'class-transformer'

export class UserEntity {
  id: string
  email: string
  username: string

  @Exclude({ toPlainOnly: true })
  passwordHash: string
  @Exclude({ toPlainOnly: true })
  authId: string
  @Exclude({ toPlainOnly: true })
  passwordResetHash: string
}
