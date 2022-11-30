import { Injectable } from '@nestjs/common'
import { MoneyTransfer, Prisma, Purchase } from '@prisma/client'
import { orderBy } from 'lodash'
import { DateTime } from 'luxon'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.AccountUncheckedCreateInput) {
    return this.prisma.account.create({ data })
  }

  findAll() {
    return this.prisma.account.findMany({ include: { currency: true } })
  }

  findOne(id: string) {
    return this.prisma.account.findUnique({
      where: { id },
      include: { currency: true },
    })
  }

  update(id: string, data: Prisma.AccountUncheckedUpdateInput) {
    return this.prisma.account.update({ where: { id }, data })
  }

  remove(id: string) {
    return this.prisma.account.delete({ where: { id } })
  }

  async recalculateBalance(id: string) {
    const account = await this.findOne(id)

    const purchases = await this.prisma.purchase.findMany({
      where: { accountId: id },
      orderBy: { date: 'asc' },
    })
    const transfers = await this.prisma.moneyTransfer.findMany({
      where: { OR: [{ sourceAccountId: id }, { targetAccountId: id }] },
      orderBy: { createdAt: 'asc' },
    })

    const actions = orderBy(
      [...purchases, ...transfers],
      [(d) => d.date ?? d.createdAt],
      ['asc'],
    )

    console.log()

    let balance = 0
    let limitUsed = 0

    const changeBalance = (value: number, date: Date) => {
      balance += parseFloat(value.toFixed(3))
      balance = parseFloat(balance.toFixed(3))

      const now = DateTime.now().toObject()
      const lastLimitReset =
        now.day < 11
          ? DateTime.now().set({ month: now.month - 1, day: 11 })
          : DateTime.now().set({ day: 11 })

      if (value < 0 && DateTime.fromJSDate(date) > lastLimitReset)
        limitUsed += Math.abs(value)

      if (value > 0) console.log(`Plus ${value}, value: ${balance}`)
      else console.log(`Minus ${Math.abs(value)}, value: ${balance}`)
    }

    let x = 0

    actions.forEach((_action) => {
      if ('targetAccountId' in _action) {
        const action = _action as MoneyTransfer
        if (action.targetAccountId === id) {
          changeBalance(+action.increment, action.createdAt)
        }
        if (action.sourceAccountId === id) {
          changeBalance(0 - action.decrement, action.createdAt)
        }
      } else {
        const action = _action as Purchase
        changeBalance(0 - action.value, action.date)
        x += action.value
      }
    })

    await this.update(id, {
      currentValue: balance,
      limitUsed,
    })
  }
}
