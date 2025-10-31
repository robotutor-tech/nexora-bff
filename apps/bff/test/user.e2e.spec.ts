import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff-ui.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('User Module (e2e)', () => {
  let app: INestApplication
  let webclient: jest.Mocked<Webclient>

  beforeEach(async () => {
    webclient = { post: jest.fn(), get: jest.fn() } as unknown as jest.Mocked<Webclient>

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(Webclient)
      .useValue(webclient)
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
    jest.clearAllMocks()
  })

  describe('POST /users/register', () => {
    it('should validate input and return 400 when email is invalid', async () => {
      const dto = { name: 'Alice Example', email: 'not-an-email', password: 'Password1', mobile: '9123456789' }

      const res = await request(app.getHttpServer()).post('/users/register').send(dto).expect(400)

      expect(res.body).toMatchObject({
        errorCode: 'NEXORA-0101',
        message: 'Validation error'
      })
      expect(webclient.post).not.toHaveBeenCalled()
    })

    it('should create user and return 201 with user payload', async () => {
      const dto = { name: 'Alice Example', email: 'alice@example.com', password: 'Password1', mobile: '9123456789' }
      const user = {
        userId: '0000000001',
        name: 'Alice Example',
        email: 'alice@example.com',
        mobile: '9123456789',
        isEmailVerified: false,
        isMobileVerified: false,
        registeredAt: '2023-01-01T00:00:00.000Z'
      }

      webclient.post.mockResolvedValueOnce(user as unknown )

      const res = await request(app.getHttpServer()).post('/users/register').send(dto).expect(201)

      expect(res.body).toStrictEqual(user)
      expect(webclient.post).toHaveBeenCalledTimes(1)
      expect(webclient.post).toHaveBeenCalledWith({ baseUrl: apiConfig.user.baseUrl, path: '', body: dto })
    })
  })

  describe('GET /users/me', () => {
    it('should return current user', async () => {
      const me = {
        userId: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '9999999999',
        isEmailVerified: false,
        isMobileVerified: false,
        registeredAt: '2023-01-01T00:00:00.000Z'
      }

      webclient.get.mockResolvedValueOnce(me as unknown )

      const res = await request(app.getHttpServer()).get('/users/me').expect(200)

      expect(res.body).toStrictEqual(me)
      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.user.baseUrl, path: apiConfig.user.me })
    })
  })
})

