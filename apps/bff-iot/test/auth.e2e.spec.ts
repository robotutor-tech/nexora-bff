import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff-iot.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('Auth Module (bff-iot) (e2e)', () => {
  let app: INestApplication
  let webclient: jest.Mocked<Webclient>

  beforeEach(async () => {
    webclient = { get: jest.fn() } as unknown as jest.Mocked<Webclient>

    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] })
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

  describe('GET /auth/validate', () => {
    it('should return validated user payload', async () => {
      const payload = { tokenIdentifier: 'AUTH_USER' }
      webclient.get.mockResolvedValueOnce(payload as unknown as Record<string, unknown>)

      const res = await request(app.getHttpServer()).get('/auth/validate').expect(200)

      expect(res.body).toStrictEqual(payload)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.auth.baseUrl, path: apiConfig.auth.validate })
    })
  })
})

