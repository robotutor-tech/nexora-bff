import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { IamController } from './iam.controller'
import { IamService } from './iam.service'
import type { TokenResponse, ValidatedUser } from './types/auth'

describe('IamController', () => {
  let controller: IamController
  let service: IamService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = {
      login: jest.fn(),
      validate: jest.fn(),
      refresh: jest.fn(),
      actorLogin: jest.fn()
    } as unknown as IamService

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IamController],
      providers: [{ provide: IamService, useValue: service }]
    }).compile()

    controller = module.get<IamController>(IamController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it('should delegate to authService.login and return token response', async () => {
      const dto = { email: 'alice@example.com', password: 'Password1' }
      const tokens: TokenResponse = { token: 'jwt', refreshToken: 'rjwt' }

      jest.spyOn(service, 'authenticateUser').mockResolvedValueOnce(tokens)

      const result = await controller.authenticateAccount(dto )

      expect(result).toStrictEqual(tokens)
      expect(service.authenticateUser).toHaveBeenCalledTimes(1)
      expect(service.authenticateUser).toHaveBeenCalledWith(dto)
    })
  })

  describe('validate', () => {
    it('should delegate to authService.validate and return validated user', async () => {
      const validated: ValidatedUser = {
        tokenIdentifier: 'AUTH_USER' 
      }

      jest.spyOn(service, 'validate').mockResolvedValueOnce(validated)

      const result = await controller.validate()

      expect(result).toStrictEqual(validated)
      expect(service.validate).toHaveBeenCalledTimes(1)
      expect(service.validate).toHaveBeenCalledWith()
    })
  })

  describe('refresh', () => {
    it('should delegate to authService.refresh and return token response', async () => {
      const tokens: TokenResponse = { token: 'jwt2', refreshToken: 'rjwt2' }

      jest.spyOn(service, 'refresh').mockResolvedValueOnce(tokens)

      const result = await controller.refresh()

      expect(result).toStrictEqual(tokens)
      expect(service.refresh).toHaveBeenCalledTimes(1)
      expect(service.refresh).toHaveBeenCalledWith()
    })
  })

  describe('actorLogin', () => {
    it('should delegate to authService.actorLogin and return token response', async () => {
      const dto = { actorId: 'a-1', roleId: 'r-1' }
      const tokens: TokenResponse = { token: 'jwt3', refreshToken: 'rjwt3' }

      jest.spyOn(service, 'authenticateActor').mockResolvedValueOnce(tokens)

      const result = await controller.actorLogin(dto )

      expect(result).toStrictEqual(tokens)
      expect(service.authenticateActor).toHaveBeenCalledTimes(1)
      expect(service.authenticateActor).toHaveBeenCalledWith(dto)
    })
  })
})
