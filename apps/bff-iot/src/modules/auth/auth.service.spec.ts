import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { Webclient, apiConfig } from '@shared'
import type { ValidatedUser } from './types/auth'

describe('AuthService', () => {
  let service: AuthService
  let webclient: Webclient

  beforeEach(async () => {
    jest.clearAllMocks()

    webclient = {
      get: jest.fn()
    } as unknown as Webclient

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: Webclient, useValue: webclient }]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('validate', () => {
    it('should call webclient.get with auth validate path and return validated user', async () => {
      const validated: ValidatedUser = { tokenIdentifier: 'AUTH_USER' }

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(validated)

      const result = await service.validate()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.auth.baseUrl, path: apiConfig.auth.validate })
      expect(result).toBe(validated)
    })
  })
})
