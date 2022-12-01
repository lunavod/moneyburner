import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { AccountsService } from 'src/accounts/accounts.service'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class PurchasesService {
  constructor(
    private prisma: PrismaService,
    private accounts: AccountsService,
  ) {}

  async create(data: Prisma.PurchaseUncheckedCreateInput) {
    const result = await this.prisma.purchase.create({ data })
    await this.accounts.recalculateBalance(data.accountId)
    return result
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

  async update(id: string, data: Prisma.PurchaseUncheckedUpdateInput) {
    const resp = await this.prisma.purchase.update({ where: { id }, data })
    await this.accounts.recalculateBalance(resp.accountId)
    return resp
  }

  async remove(id: string) {
    const p = await this.findOne(id)
    await this.prisma.purchase.delete({ where: { id } })
    await this.accounts.recalculateBalance(p.accountId)
  }
}
