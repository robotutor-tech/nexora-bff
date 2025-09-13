import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { MqttService } from './mqtt.service'
import { Webclient, apiConfig } from '@shared'

describe('MqttService', () => {
  let service: MqttService
  let webclient: Webclient

  beforeEach(async () => {
    jest.clearAllMocks()

    webclient = {
      get: jest.fn()
    } as unknown as Webclient

    const module: TestingModule = await Test.createTestingModule({
      providers: [MqttService, { provide: Webclient, useValue: webclient }]
    }).compile()

    service = module.get<MqttService>(MqttService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('validateAuthToken', () => {
    it('should call webclient.get with auth validate path + Authorization header and return allow with internal_id', async () => {
      const req = { password: 'Bearer jwt' }

      jest.spyOn(webclient, 'get').mockResolvedValueOnce({ token: 'ok' } )

      const result = await service.validateAuthToken(req )

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({
        baseUrl: apiConfig.auth.baseUrl,
        path: apiConfig.auth.validate,
        headers: { Authorization: req.password }
      })
      expect(result.result).toBe('allow')
      expect(result.client_attrs?.internal_id).toEqual(expect.any(String))
    })

    it('should still return allow if webclient.get throws', async () => {
      const req = { password: 'Bearer bad' }
      jest.spyOn(webclient, 'get').mockRejectedValueOnce(new Error('fail'))

      const result = await service.validateAuthToken(req )

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(result.result).toBe('allow')
      expect(result.client_attrs?.internal_id).toEqual(expect.any(String))
    })
  })

  describe('validateAcl', () => {
    it('should return allow for any input', async () => {
      const req = { username: 'alice' }
      const result = await service.validateAcl(req )
      expect(result).toEqual({ result: 'allow' })
    })
  })
})

