import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('Automation Module (e2e)', () => {
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

  describe('POST /automations', () => {
    it('should 400 when TIME_RANGE has same start and end time', async () => {
      const dto = { name: 'Morning', config: { type: 'TIME_RANGE', startTime: '06:00', endTime: '06:00' } }
      const res = await request(app.getHttpServer()).post('/automations').send(dto).expect(400)
      expect(res.body).toMatchObject({ errorCode: 'NEXORA-0101', message: 'Validation error' })
      expect(webclient.post).not.toHaveBeenCalled()
    })

    it('should 201 and create automation', async () => {
      const dto = { name: 'Morning', config: { type: 'TIME_RANGE', startTime: '06:00', endTime: '07:00' } }
      const automation = { automationId: 'a-1', name: 'Morning', triggers: [], actions: [], description: 'desc' }
      webclient.post.mockResolvedValueOnce(automation)
      const res = await request(app.getHttpServer()).post('/automations').send(dto).expect(201)
      expect(res.body).toStrictEqual(automation)
      expect(webclient.post).toHaveBeenCalledWith({
        baseUrl: apiConfig.automation.baseUrl,
        path: apiConfig.automation.automations,
        body: dto
      })
    })
  })

  describe('GET /automations', () => {
    it('should return automations', async () => {
      const list = [
        { automationId: 'a-1', name: 'Morning', triggers: [], actions: [], description: 'desc' }
      ]
      webclient.get.mockResolvedValueOnce(list)
      const res = await request(app.getHttpServer()).get('/automations').expect(200)
      expect(res.body).toStrictEqual(list)
      expect(webclient.get).toHaveBeenCalledWith({
        baseUrl: apiConfig.automation.baseUrl,
        path: apiConfig.automation.automations
      })
    })
  })
})

