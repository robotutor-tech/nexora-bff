import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('Premises Module (e2e)', () => {
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

  describe('POST /premises', () => {
    it('should 400 when name is too short', async () => {
      const dto = {
        name: 'Hom',
        address: { street: '1', city: 'c', state: 's', country: 'i', postalCode: '12' }
      }
      const res = await request(app.getHttpServer()).post('/premises').send(dto).expect(400)
      expect(res.body).toMatchObject({ errorCode: 'NEXORA-0101', message: 'Validation error' })
      expect(webclient.post).not.toHaveBeenCalled()
    })

    it('should 201 and create premises', async () => {
      const dto = {
        name: 'Home',
        address: { street: '11', city: 'cc', state: 'cs', country: 'it', postalCode: '123456' }
      }
      const payload = { premisesId: 'p-1', name: 'Home', createdAt: '2023-01-01T00:00:00.000Z', actor: [] }
      webclient.post.mockResolvedValueOnce(payload as unknown as Record<string, unknown>)

      const res = await request(app.getHttpServer()).post('/premises').send(dto).expect(201)

      expect(res.body).toStrictEqual(payload)
      expect(webclient.post).toHaveBeenCalledWith({
        baseUrl: apiConfig.premises.baseUrl,
        path: apiConfig.premises.premises,
        body: dto
      })
    })
  })

  describe('GET /premises', () => {
    it('should return premises list', async () => {
      const list = [
        { premisesId: 'p-1', name: 'Home', createdAt: '2023-01-01T00:00:00.000Z', actor: [] }
      ]
      webclient.get.mockResolvedValueOnce(list as unknown as Array<Record<string, unknown>>)

      const res = await request(app.getHttpServer()).get('/premises').expect(200)

      expect(res.body).toStrictEqual(list)
      expect(webclient.get).toHaveBeenCalledWith({
        baseUrl: apiConfig.premises.baseUrl,
        path: apiConfig.premises.premises
      })
    })
  })

  describe('GET /premises/:premisesId', () => {
    it('should 400 for non-numeric premisesId', async () => {
      const res = await request(app.getHttpServer()).get('/premises/abc').expect(400)
      expect(res.body).toMatchObject({ errorCode: 'NEXORA-0101', message: 'Validation error' })
      expect(webclient.get).not.toHaveBeenCalled()
    })

    it('should 200 and return premises details', async () => {
      const payload = { premisesId: '1', name: 'Home', createdAt: '2023-01-01T00:00:00.000Z' }
      webclient.get.mockResolvedValueOnce(payload as unknown as Record<string, unknown>)

      const res = await request(app.getHttpServer()).get('/premises/1').expect(200)

      expect(res.body).toStrictEqual(payload)
      expect(webclient.get).toHaveBeenCalledWith({
        baseUrl: apiConfig.premises.baseUrl,
        path: apiConfig.premises.premisesDetails,
        uriVariables: { premisesId: '1' }
      })
    })
  })
})

