import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { plainToInstance } from 'class-transformer'
import { omit } from 'lodash'
import { PrismaService } from 'src/prisma.service'
import { v4 } from 'uuid'

import { CreateUserDto } from './dto/create.dto'
import { UpdateUserDto } from './dto/update.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: Prisma.UserUncheckedCreateInput) {
    return this.prisma.user.create({ data: input })
  }

  async findAll(): Promise<UserEntity[]> {
    return plainToInstance(UserEntity, await this.prisma.user.findMany())
  }

  async findOne(id: string): Promise<UserEntity> {
    return plainToInstance(
      UserEntity,
      await this.prisma.user.findUnique({ where: { id } }),
    )
  }

  updateRaw(id: string, input: Prisma.UserUncheckedUpdateInput) {
    return this.prisma.user.update({ where: { id }, data: input })
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } })
  }

  async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10)
    return hash
  }

  checkPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash)
  }

  async register(data: CreateUserDto) {
    const hash = await this.hashPassword(data.password)
    const authId = v4()

    return this.create({
      username: data.username,
      email: data.email,
      passwordHash: hash,
      authId,
    })
  }

  async update(id: string, data: UpdateUserDto) {
    const input: Prisma.UserUncheckedUpdateInput = omit(data, ['password'])
    if (data.password) {
      input.passwordHash = await this.hashPassword(data.password)
      input.authId = v4()
    }

    return this.updateRaw(id, input)
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } })
  }

  findByAuthId(authId: string) {
    return this.prisma.user.findUnique({ where: { authId } })
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  findByPasswordResetHash(hash: string) {
    return this.prisma.user.findUnique({ where: { passwordResetHash: hash } })
  }

  async setPasswordResetHash(id: string) {
    const hash = v4()
    await this.prisma.user.update({
      where: { id },
      data: { passwordResetHash: hash },
    })
    return hash
  }

  async resetPasswordResetHash(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { passwordResetHash: null },
    })
  }
}
