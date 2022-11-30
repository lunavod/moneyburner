import { groupBy, omit } from 'lodash'
import { DateTime } from 'luxon'
import { LeumiService } from 'src/leumi/leumi.service'
import { PrismaService } from 'src/prisma.service'
import { TaskRunner } from 'src/tasks/task-manager'
import { ClickHouseLogger } from 'src/utils/clickhouse.logger'

@TaskRunner('parseLeumi')
export class ParseLeumi {
  private logger: ClickHouseLogger

  constructor(private prisma: PrismaService, private leumi: LeumiService) {}

  async main(task, run, logger) {
    this.logger = logger

    const accounts = await this.prisma.account.findMany({
      where: {
        leumiLogin: { not: null },
        leumiPassword: { not: null },
        leumiCardNumber: { not: null },
      },
    })

    for (const account of accounts) {
      const { records, transfers } = await this.leumi.parse(
        account.leumiLogin,
        account.leumiPassword,
        account.leumiCardNumber,
      )

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
          where: {
            targetAccountId: account.id,
            increment: record.value,
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
                increment: group[0].value,
                decrement: 0,
                userId: account.userId,
                date: group[0].date,
                targetAccountId: account.id,
              },
            })
          }
        }
      }
    }

    this.logger.log('DONE')
  }
}
