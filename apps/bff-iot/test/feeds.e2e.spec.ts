import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff-iot.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('Feeds Module (bff-iot) (e2e)', () => {
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

  describe('GET /feeds', () => {
    it('should return feeds', async () => {
      const feeds = [
        { feedId: 'f-1', premisesId: 'p-1', name: 'Temperature', value: 24.5 }
      ]
      webclient.get.mockResolvedValueOnce(feeds as unknown as Array<Record<string, unknown>>)

      const res = await request(app.getHttpServer()).get('/feeds').expect(200)

      expect(res.body).toStrictEqual(feeds)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.feed.baseUrl, path: '' })
    })
  })
})

