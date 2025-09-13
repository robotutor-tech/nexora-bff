import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { Webclient, apiConfig } from '@shared'
import type { TokenResponse, ValidatedUser } from './types/auth'

describe('AuthService', () => {
  let service: AuthService
  let webclient: Webclient

  beforeEach(async () => {
    jest.clearAllMocks()

    webclient = {
      post: jest.fn(),
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

  describe('login', () => {
    it('should call webclient.post with auth login path and return tokens', async () => {
      const req = { email: 'alice@example.com', password: 'Password1' }
      const tokens: TokenResponse = { token: 'jwt', refreshToken: 'rjwt' }

      jest.spyOn(webclient, 'post').mockResolvedValueOnce(tokens)

      const result = await service.login(req)

      expect(webclient.post).toHaveBeenCalledTimes(1)
      expect(webclient.post).toHaveBeenCalledWith({ baseUrl: apiConfig.auth.baseUrl, path: apiConfig.auth.login, body: req })
      expect(result).toBe(tokens)
    })
  })

  describe('validate', () => {
    it('should call webclient.get with auth validate path and return validated user', async () => {
      const validated: ValidatedUser = { tokenIdentifier: 'AUTH_USER'  }

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(validated)

      const result = await service.validate()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.auth.baseUrl, path: apiConfig.auth.validate })
      expect(result).toBe(validated)
    })
  })

  describe('actorLogin', () => {
    it('should call webclient.post with auth actorLogin path and return tokens', async () => {
      const req = { actorId: 'a-1', roleId: 'r-1' }
      const tokens: TokenResponse = { token: 'jwt2', refreshToken: 'rjwt2' }

      jest.spyOn(webclient, 'post').mockResolvedValueOnce(tokens)

      const result = await service.actorLogin(req)

      expect(webclient.post).toHaveBeenCalledTimes(1)
      expect(webclient.post).toHaveBeenCalledWith({ baseUrl: apiConfig.auth.baseUrl, path: apiConfig.auth.actorLogin, body: req })
      expect(result).toBe(tokens)
    })
  })

  describe('refresh', () => {
    it('should call webclient.get with auth refresh path and return tokens', async () => {
      const tokens: TokenResponse = { token: 'jwt3', refreshToken: 'rjwt3' }

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(tokens)

      const result = await service.refresh()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.auth.baseUrl, path: apiConfig.auth.refresh })
      expect(result).toBe(tokens)
    })
  })
})
