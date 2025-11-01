import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('Devices Module (e2e)', () => {
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

  describe('POST /devices/invitations', () => {
    it('should 400 when name is too short', async () => {
      const dto = { name: 'Abc', zoneId: 'z-1' }
      const res = await request(app.getHttpServer()).post('/devices/invitations').send(dto).expect(400)
      expect(res.body).toMatchObject({ errorCode: 'NEXORA-0101', message: 'Validation error' })
      expect(webclient.post).not.toHaveBeenCalled()
    })

    it('should 201 and create device invitation', async () => {
      const dto = { name: 'Sensor', zoneId: 'z-1' }
      const invitation = { token: 'tkn', name: 'Sensor', invitationId: 'i-1', modelNo: 'M-100' }
      webclient.post.mockResolvedValueOnce(invitation as unknown as Record<string, unknown>)
      const res = await request(app.getHttpServer()).post('/devices/invitations').send(dto).expect(201)
      expect(res.body).toStrictEqual(invitation)
      expect(webclient.post).toHaveBeenCalledWith({
        baseUrl: apiConfig.auth.baseUrl,
        path: apiConfig.auth.deviceInvitation,
        body: dto
      })
    })
  })

  describe('GET /devices', () => {
    it('should return devices', async () => {
      const devices = [
        {
          deviceId: 'd-1',
          premisesId: 'p-1',
          name: 'Thermostat',
          modelNo: 'M-100',
          serialNo: 'S-1',
          type: 'DEVICE',
          state: 'ACTIVE',
          health: 'ONLINE'
        }
      ]
      webclient.get.mockResolvedValueOnce(devices as unknown as Array<Record<string, unknown>>)
      const res = await request(app.getHttpServer()).get('/devices').expect(200)
      expect(res.body).toStrictEqual(devices)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.device.baseUrl, path: '' })
    })
  })

  describe('GET /devices/invitations', () => {
    it('should return device invitations', async () => {
      const invitations = [
        { token: 'tkn', name: 'Sensor', invitationId: 'i-1', modelNo: 'M-100' }
      ]
      webclient.get.mockResolvedValueOnce(invitations as unknown as Array<Record<string, unknown>>)
      const res = await request(app.getHttpServer()).get('/devices/invitations').expect(200)
      expect(res.body).toStrictEqual(invitations)
      expect(webclient.get).toHaveBeenCalledWith({
        baseUrl: apiConfig.auth.baseUrl,
        path: apiConfig.auth.deviceInvitation
      })
    })
  })
})
