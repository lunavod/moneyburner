import { Prisma, PrismaClient } from '@prisma/client'

export async function RESET_DB(prisma: PrismaClient, schemaName: string) {
  const tables = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname=${schemaName}`

  for (const { tablename } of tables) {
    const str = `TRUNCATE TABLE "${schemaName}"."${tablename}" CASCADE;`
    await prisma.$queryRaw(Prisma.sql([str]))
  }

  const relations = await prisma.$queryRaw<
    { relname: string }[]
  >`SELECT c.relname FROM pg_class AS c JOIN pg_namespace AS n ON 
    c.relnamespace = n.oid WHERE c.relkind='S' AND n.nspname=${schemaName};`

  for (const { relname } of relations) {
    const str = `ALTER SEQUENCE "${schemaName}"."${relname}" RESTART WITH 1;`
    await prisma.$queryRaw(Prisma.sql([str]))
  }
}
