import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('Rule Module (e2e)', () => {
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

  describe('POST /rules', () => {
    it('should 400 when type/config.type combination is invalid', async () => {
      const dto = { name: 'Invalid', type: 'ACTION', config: { type: 'VOICE', commands: ['go'] } }
      const res = await request(app.getHttpServer()).post('/rules').send(dto).expect(400)
      expect(res.body).toMatchObject({ errorCode: 'NEXORA-0101', message: 'Validation error' })
      expect(webclient.post).not.toHaveBeenCalled()
    })

    it('should 201 and create TRIGGER VOICE rule', async () => {
      const dto = { name: 'My Rule', type: 'TRIGGER', config: { type: 'VOICE', commands: ['turn on'] } }
      const rule = { ruleId: 'r-1', name: 'My Rule', type: 'TRIGGER', config: { type: 'VOICE', commands: ['turn on'] } }
      webclient.post.mockResolvedValueOnce(rule as unknown as Record<string, unknown>)
      const res = await request(app.getHttpServer()).post('/rules').send(dto).expect(201)
      expect(res.body).toStrictEqual(rule)
      expect(webclient.post).toHaveBeenCalledWith({
        baseUrl: apiConfig.rule.baseUrl,
        path: apiConfig.rule.rules,
        body: dto
      })
    })
  })

  describe('GET /rules', () => {
    it('should return rules', async () => {
      const rules = [
        { ruleId: 'r-1', name: 'My Rule', type: 'TRIGGER', config: { type: 'VOICE', commands: ['turn on'] } }
      ]
      webclient.get.mockResolvedValueOnce(rules as unknown as Array<Record<string, unknown>>)
      const res = await request(app.getHttpServer()).get('/rules').expect(200)
      expect(res.body).toStrictEqual(rules)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.rule.baseUrl, path: apiConfig.rule.rules })
    })
  })
})

