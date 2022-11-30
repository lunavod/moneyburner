import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiPropertyOptional()
  username?: string

  @ApiPropertyOptional()
  email?: string

  @ApiPropertyOptional()
  password?: string
}
