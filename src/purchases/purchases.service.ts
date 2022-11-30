import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.PurchaseUncheckedCreateInput) {
    return this.prisma.purchase.create({ data })
  }

  findAll() {
    return this.prisma.purchase.findMany({
      include: { store: true, account: { include: { currency: true } } },
    })
  }

  findOne(id: string) {
    return this.prisma.purchase.findUnique({
      where: { id },
      include: { store: true, account: { include: { currency: true } } },
    })
  }

  update(id: string, data: Prisma.PurchaseUncheckedUpdateInput) {
    return this.prisma.purchase.update({ where: { id }, data })
  }

  remove(id: string) {
    return this.prisma.purchase.delete({ where: { id } })
  }
}
