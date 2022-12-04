import { groupBy, omit } from 'lodash'
import { DateTime } from 'luxon'
import { AccountsService } from 'src/accounts/accounts.service'
import { LeumiService } from 'src/leumi/leumi.service'
import { PrismaService } from 'src/prisma.service'
import { TaskRunner } from 'src/tasks/task-manager'
import { ClickHouseLogger } from 'src/utils/clickhouse.logger'

@TaskRunner('parseLeumi')
export class ParseLeumi {
  private logger: ClickHouseLogger

  constructor(
    private prisma: PrismaService,
    private leumi: LeumiService,
    private accounts: AccountsService,
  ) {}

  async main(task, run, logger) {
    this.logger = logger

    const accounts = await this.prisma.account.findMany({
      where: {
        AND: [
          {
            leumiLogin: { not: null },
            leumiPassword: { not: null },
            leumiCardNumber: { not: null },
          },
          {
            leumiLogin: { not: '' },
            leumiPassword: { not: '' },
            leumiCardNumber: { not: '' },
          },
        ],
      },
    })

    for (const account of accounts) {
      console.log(account)
      const { records, transfers } = await this.leumi.parse(
        account.leumiLogin,
        account.leumiPassword,
        account.leumiCardNumber,
      )
      console.log(records, transfers)

      const recordGroups = groupBy(
        records.flat(),
        (r) => `${r.date}-${r.shop}-${r.value}`,
      )

      for (const group of Object.values(recordGroups)) {
        const record = group[0]
        const existing = await this.prisma.purchase.findMany({
          where: {
            store: { name: record.shop },
            value: record.value,
          },
        })

        const existingStore = await this.prisma.store.findFirst({
          where: { name: record.shop, userId: account.userId },
        })
        const store =
          existingStore ??
          (await this.prisma.store.create({
            data: {
              name: record.shop,
              userId: account.userId,
            },
          }))

        const diff =
          group.length -
          existing.filter((e) => e.date.getTime() === group[0].date.getTime())
            .length

        if (diff > 0) {
          for (let i = 0; i < diff; i++) {
            await this.prisma.purchase.create({
              data: {
                storeId: store.id,
                value: group[0].value,
                userId: account.userId,
                date: group[0].date,
                accountId: account.id,
              },
            })
          }
        }
      }

      const transferGroups = groupBy(transfers, (r) => `${r.date}-${r.value}`)

      for (const group of Object.values(transferGroups)) {
        const record = group[0]
        const existing = await this.prisma.moneyTransfer.findMany({
          where:
            record.value > 0
              ? {
                  targetAccountId: account.id,
                  increment: record.value,
                }
              : {
                  sourceAccountId: account.id,
                  decrement: Math.abs(record.value),
                },
        })

        const diff =
          group.length -
          existing.filter(
            (e) =>
              DateTime.fromJSDate(e.date).startOf('day').toSeconds() ===
              DateTime.fromJSDate(group[0].date).startOf('day').toSeconds(),
          ).length

        if (diff > 0) {
          for (let i = 0; i < diff; i++) {
            await this.prisma.moneyTransfer.create({
              data: {
                increment: record.value > 0 ? group[0].value : 0,
                decrement: record.value > 0 ? 0 : Math.abs(group[0].value),
                userId: account.userId,
                date: group[0].date,
                targetAccountId: record.value > 0 ? account.id : null,
                sourceAccountId: record.value > 0 ? null : account.id,
              },
            })
          }
        }
      }

      await this.accounts.recalculateBalance(account.id)
    }

    this.logger.log('DONE')
  }
}
