import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('Actor Module (e2e)', () => {
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

  describe('GET /actors/me', () => {
    it('should return current actor', async () => {
      const actor = { actorId: 'a-1', premisesId: 'p-1', role: { roleId: 'r-1', name: 'Admin', roleType: 'ADMIN' } }
      webclient.get.mockResolvedValueOnce(actor )

      const res = await request(app.getHttpServer()).get('/actors/me').expect(200)

      expect(res.body).toStrictEqual(actor)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.actor.baseUrl, path: apiConfig.actor.me })
    })
  })
})
