import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { UserService } from './user.service'
import { Webclient, apiConfig } from '@shared'

describe('UserService', () => {
  let service: UserService
  let webclient: Webclient

  beforeEach(async () => {
    jest.clearAllMocks()

    webclient = {
      post: jest.fn(),
      get: jest.fn()
    } as unknown as Webclient

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: Webclient, useValue: webclient }]
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('registerUser', () => {
    it('should call webclient.post with baseUrl and path and return user', async () => {
      const req = {
        name: 'Alice Example',
        email: 'alice@example.com',
        mobile: '9123456789',
        password: 'Password@1'
      }
      const user = {
        userId: '0000000001',
        name: 'Alice Example',
        email: 'alice@example.com',
        mobile: '9123456789',
        isEmailVerified: false,
        isMobileVerified: false,
        registeredAt: new Date('2023-01-01T00:00:00Z')
      }

      jest.spyOn(webclient, 'post').mockResolvedValueOnce(user)

      const result = await service.registerUser(req)

      expect(webclient.post).toHaveBeenCalledTimes(1)
      expect(webclient.post).toHaveBeenCalledWith({ baseUrl: apiConfig.user.baseUrl, path: '', body: req })
      expect(result).toBe(user)
    })
  })

  describe('me', () => {
    it('should call webclient.get with baseUrl and me path and return user', async () => {
      const me = { userId: 'user-1', name: 'John Doe', email: 'john@example.com' }
      jest.spyOn(webclient, 'get').mockResolvedValueOnce(me)

      const result = await service.me()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.user.baseUrl, path: apiConfig.user.me })
      expect(result).toBe(me)
    })
  })
})
