import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class MoneyTransfersService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.MoneyTransferUncheckedCreateInput) {
    return this.prisma.moneyTransfer.create({ data })
  }

  findAll() {
    return this.prisma.moneyTransfer.findMany({
      include: {
        sourceAccount: { include: { currency: true } },
        targetAccount: { include: { currency: true } },
      },
    })
  }

  findOne(id: string) {
    return this.prisma.moneyTransfer.findUnique({
      where: { id },
      include: {
        sourceAccount: { include: { currency: true } },
        targetAccount: { include: { currency: true } },
      },
    })
  }

  update(id: string, data: Prisma.MoneyTransferUncheckedUpdateInput) {
    return this.prisma.moneyTransfer.update({ where: { id }, data })
  }

  remove(id: string) {
    return this.prisma.moneyTransfer.delete({ where: { id } })
  }
}
