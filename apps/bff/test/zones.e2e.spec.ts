import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff-ui.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('Zones Module (e2e)', () => {
  let app: INestApplication
  let webclient: jest.Mocked<Webclient>

  beforeEach(async () => {
    webclient = { post: jest.fn(), get: jest.fn() } as unknown as jest.Mocked<Webclient>

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

  describe('POST /zones', () => {
    it('should 400 when name is too short', async () => {
      const dto = { name: 'Abc' }
      const res = await request(app.getHttpServer()).post('/zones').send(dto).expect(400)
      expect(res.body).toMatchObject({ errorCode: 'NEXORA-0101', message: 'Validation error' })
      expect(webclient.post).not.toHaveBeenCalled()
    })

    it('should 201 and create zone', async () => {
      const dto = { name: 'Living Room' }
      const zone = {
        zoneId: 'z-1',
        name: 'Living Room',
        premisesId: 'p-1',
        createdAt: '2023-01-01T00:00:00.000Z'
      }
      webclient.post.mockResolvedValueOnce(zone as unknown as Record<string, unknown>)
      const res = await request(app.getHttpServer()).post('/zones').send(dto).expect(201)
      expect(res.body).toStrictEqual(zone)
      expect(webclient.post).toHaveBeenCalledWith({ baseUrl: apiConfig.zone.baseUrl, path: '', body: dto })
    })
  })

  describe('GET /zones', () => {
    it('should return zones', async () => {
      const zones = [
        { zoneId: 'z-1', name: 'Living Room', premisesId: 'p-1', createdAt: '2023-01-01T00:00:00.000Z' }
      ]
      webclient.get.mockResolvedValueOnce(zones as unknown as Array<Record<string, unknown>>)
      const res = await request(app.getHttpServer()).get('/zones').expect(200)
      expect(res.body).toStrictEqual(zones)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.zone.baseUrl, path: '' })
    })
  })
})
