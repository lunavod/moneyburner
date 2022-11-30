export class CreateMoneyTransferDto {
  increment: number
  decrement: number
  sourceAccountId?: string
  targetAccountId: string
  name?: string
}
