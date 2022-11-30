import { PartialType } from '@nestjs/mapped-types'

import { CreatePurchaseElementDto } from './create-purchase-element.dto'

export class UpdatePurchaseElementDto extends PartialType(
  CreatePurchaseElementDto,
) {}
