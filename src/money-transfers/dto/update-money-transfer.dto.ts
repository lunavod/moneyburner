import { PartialType } from '@nestjs/mapped-types'

import { CreateMoneyTransferDto } from './create-money-transfer.dto'

export class UpdateMoneyTransferDto extends PartialType(
  CreateMoneyTransferDto,
) {}
