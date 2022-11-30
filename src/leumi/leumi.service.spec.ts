import { Test, TestingModule } from '@nestjs/testing'

import { LeumiService } from './leumi.service'

describe('LeumiService', () => {
  let service: LeumiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeumiService],
    }).compile()

    service = module.get<LeumiService>(LeumiService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
