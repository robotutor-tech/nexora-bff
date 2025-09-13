import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import type { TokenResponse, ValidatedUser } from './types/auth'

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = {
      login: jest.fn(),
      validate: jest.fn(),
      refresh: jest.fn(),
      actorLogin: jest.fn()
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

  describe('login', () => {
    it('should delegate to authService.login and return token response', async () => {
      const dto = { email: 'alice@example.com', password: 'Password1' }
      const tokens: TokenResponse = { token: 'jwt', refreshToken: 'rjwt' }

      jest.spyOn(service, 'login').mockResolvedValueOnce(tokens)

      const result = await controller.login(dto )

      expect(result).toStrictEqual(tokens)
      expect(service.login).toHaveBeenCalledTimes(1)
      expect(service.login).toHaveBeenCalledWith(dto)
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

      jest.spyOn(service, 'actorLogin').mockResolvedValueOnce(tokens)

      const result = await controller.actorLogin(dto )

      expect(result).toStrictEqual(tokens)
      expect(service.actorLogin).toHaveBeenCalledTimes(1)
      expect(service.actorLogin).toHaveBeenCalledWith(dto)
    })
  })
})
