import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff-iot.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('Devices Module (bff-iot) (e2e)', () => {
  let app: INestApplication
  let webclient: jest.Mocked<Webclient>

  beforeEach(async () => {
    webclient = { post: jest.fn() } as unknown as jest.Mocked<Webclient>

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

  describe('POST /devices/register', () => {
    it('should 400 when payload is invalid (missing serialNo)', async () => {
      const dto = { modelNo: 'M-100', type: 'DEVICE' }
      const res = await request(app.getHttpServer()).post('/devices/register').send(dto).expect(400)
      expect(res.body).toMatchObject({ errorCode: 'NEXORA-0101', message: 'Validation error' })
      expect(webclient.post).not.toHaveBeenCalled()
    })

    it('should 201 and return device invitation', async () => {
      const dto = { serialNo: 'SN-1', modelNo: 'M-100', type: 'DEVICE' }
      const invitation = { token: 'tkn', name: 'Edge Gateway', invitationId: 'i-1', modelNo: 'M-100' }
      webclient.post.mockResolvedValueOnce(invitation as unknown as Record<string, unknown>)

      const res = await request(app.getHttpServer()).post('/devices/register').send(dto).expect(201)

      expect(res.body).toStrictEqual(invitation)
      expect(webclient.post).toHaveBeenCalledWith({ baseUrl: apiConfig.device.baseUrl, path: '', body: dto })
    })
  })
})

