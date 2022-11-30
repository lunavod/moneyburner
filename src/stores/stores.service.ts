import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.StoreUncheckedCreateInput) {
    return this.prisma.store.create({ data })
  }

  findAll() {
    return this.prisma.store.findMany()
  }

  findOne(id: string) {
    return this.prisma.store.findUnique({ where: { id } })
  }

  update(id: string, data: Prisma.StoreUncheckedUpdateInput) {
    return this.prisma.store.update({ where: { id }, data })
  }

  remove(id: string) {
    return this.prisma.store.delete({ where: { id } })
  }
}
