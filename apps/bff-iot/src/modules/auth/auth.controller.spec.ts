import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import type { ValidatedUser } from './types/auth'

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = {
      validate: jest.fn()
    } as unknown as AuthService

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: service }]
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('validate', () => {
    it('should delegate to authService.validate and return validated user', async () => {
      const validated: ValidatedUser = { tokenIdentifier: 'AUTH_USER'  }

      jest.spyOn(service, 'validate').mockResolvedValueOnce(validated)

      const result = await controller.validate()

      expect(result).toStrictEqual(validated)
      expect(service.validate).toHaveBeenCalledTimes(1)
      expect(service.validate).toHaveBeenCalledWith()
    })
  })
})
