import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff-ui.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('Widgets Module (e2e)', () => {
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

  describe('GET /widgets', () => {
    it('should return widgets', async () => {
      const widgets = [
        {
          widgetId: 'w-1',
          zoneId: 'z-1',
          premisesId: 'p-1',
          feedId: 'f-1',
          name: 'Temperature',
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ]
      webclient.get.mockResolvedValueOnce(widgets as unknown as Array<Record<string, unknown>>)

      const res = await request(app.getHttpServer()).get('/widgets').expect(200)

      expect(res.body).toStrictEqual(widgets)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.widget.baseUrl, path: '' })
    })
  })
})

