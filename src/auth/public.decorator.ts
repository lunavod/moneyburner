import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'
export const IS_ONLY_PUBLIC_KEY = 'isOnlyPublic'
export const Public = (opts?: { only?: boolean }) => {
  return SetMetadata(IS_PUBLIC_KEY, { only: !!opts?.only })
}
