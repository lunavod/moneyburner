import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { AccountsService } from 'src/accounts/accounts.service'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class MoneyTransfersService {
  constructor(
    private prisma: PrismaService,
    private accounts: AccountsService,
  ) {}

  async create(data: Prisma.MoneyTransferUncheckedCreateInput) {
    const resp = await this.prisma.moneyTransfer.create({ data })
    if (resp.targetAccountId)
      await this.accounts.recalculateBalance(resp.targetAccountId)
    if (resp.sourceAccountId)
      await this.accounts.recalculateBalance(resp.sourceAccountId)
    return resp
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

  async update(id: string, data: Prisma.MoneyTransferUncheckedUpdateInput) {
    const resp = await this.prisma.moneyTransfer.update({ where: { id }, data })
    if (resp.targetAccountId)
      await this.accounts.recalculateBalance(resp.targetAccountId)
    if (resp.sourceAccountId)
      await this.accounts.recalculateBalance(resp.sourceAccountId)
    return resp
  }

  async remove(id: string) {
    const resp = await this.findOne(id)

    if (resp.targetAccountId)
      await this.accounts.recalculateBalance(resp.targetAccountId)
    if (resp.sourceAccountId)
      await this.accounts.recalculateBalance(resp.sourceAccountId)

    await this.prisma.moneyTransfer.delete({ where: { id } })
  }
}
