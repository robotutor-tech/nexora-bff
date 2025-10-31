import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import type { User } from './types/user'

describe('UserController', () => {
  let controller: UserController
  let service: UserService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = {
      registerUser: jest.fn(),
      me: jest.fn()
    } as unknown as UserService

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: service }]
    }).compile()

    controller = module.get(UserController)
  })

  describe('Register user', () => {
    it('should delegate to userService.registerUser and return the result', async () => {
      const dto = {
        name: 'Alice Example',
        email: 'alice@example.com',
        mobile: '9123456789',
        password: 'Password@1'
      }

      const user: User = {
        userId: '0000000001',
        name: 'Alice Example',
        email: 'alice@example.com',
        mobile: '9123456789',
        isEmailVerified: false,
        isMobileVerified: false,
        registeredAt: new Date('2023-01-01T00:00:00Z')
      }

      jest.spyOn(service, 'registerUser').mockResolvedValueOnce(user)

      const result = await controller.registerUser(dto)

      expect(result).toStrictEqual(user)

      expect(service.registerUser).toHaveBeenCalledTimes(1)
      expect(service.registerUser).toHaveBeenCalledWith(dto)
    })
  })

  describe('me', () => {
    it('should delegate to userService.me and return the current user', async () => {
      const me: User = {
        isEmailVerified: false,
        isMobileVerified: false,
        mobile: '',
        registeredAt: new Date('2023-01-01T00:00:00Z'),
        userId: 'user-1',
        name: 'John Doe',
        email: 'john@example.com'
      }

      jest.spyOn(service, 'me').mockResolvedValueOnce(me)

      const result = await controller.me()

      expect(result).toStrictEqual(me)
      expect(service.me).toHaveBeenCalledTimes(1)
      expect(service.me).toHaveBeenCalledWith()
    })
  })
})
