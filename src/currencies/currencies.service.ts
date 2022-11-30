import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.CurrencyUncheckedCreateInput) {
    return this.prisma.currency.create({ data })
  }

  findAll() {
    return this.prisma.currency.findMany()
  }

  findOne(id: string) {
    return this.prisma.currency.findUnique({ where: { id } })
  }

  update(id: string, data: Prisma.CurrencyUncheckedUpdateInput) {
    return this.prisma.currency.update({ where: { id }, data })
  }

  remove(id: string) {
    return this.prisma.currency.delete({ where: { id } })
  }
}
