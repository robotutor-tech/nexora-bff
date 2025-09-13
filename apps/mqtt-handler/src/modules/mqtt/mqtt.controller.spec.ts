import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { MqttController } from './mqtt.controller'
import { MqttService } from './mqtt.service'
import type { AuthResponse } from './types/mqtt'

describe('MqttController', () => {
  let controller: MqttController
  let service: MqttService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = {
      validateAuthToken: jest.fn(),
      validateAcl: jest.fn()
    } as unknown as MqttService

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MqttController],
      providers: [{ provide: MqttService, useValue: service }]
    }).compile()

    controller = module.get<MqttController>(MqttController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('validateMqttToken', () => {
    it('should delegate to mqttService.validateAuthToken and return response', async () => {
      const dto = { password: 'Bearer tkn' }
      const resp: AuthResponse = { result: 'allow', client_attrs: { internal_id: 'id-1' } }

      jest.spyOn(service, 'validateAuthToken').mockResolvedValueOnce(resp)

      const result = await controller.validateMqttToken(dto )

      expect(result).toStrictEqual(resp)
      expect(service.validateAuthToken).toHaveBeenCalledTimes(1)
      expect(service.validateAuthToken).toHaveBeenCalledWith(dto)
    })
  })

  describe('validateAcl', () => {
    it('should delegate to mqttService.validateAcl and return response', async () => {
      const dto = { username: 'alice' }
      const resp = { result: 'allow' as const }

      jest.spyOn(service, 'validateAcl').mockResolvedValueOnce(resp)

      const result = await controller.validateAcl(dto )

      expect(result).toStrictEqual(resp)
      expect(service.validateAcl).toHaveBeenCalledTimes(1)
      expect(service.validateAcl).toHaveBeenCalledWith(dto)
    })
  })
})

