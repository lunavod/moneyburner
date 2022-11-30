import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class PurchaseElementsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.PurchaseElementUncheckedCreateInput) {
    return this.prisma.purchaseElement.create({ data })
  }

  findAll() {
    return this.prisma.purchaseElement.findMany()
  }

  findOne(id: string) {
    return this.prisma.purchaseElement.findUnique({ where: { id } })
  }

  update(id: string, data: Prisma.PurchaseElementUncheckedUpdateInput) {
    return this.prisma.purchaseElement.update({ where: { id }, data })
  }

  remove(id: string) {
    return this.prisma.purchaseElement.delete({ where: { id } })
  }
}
