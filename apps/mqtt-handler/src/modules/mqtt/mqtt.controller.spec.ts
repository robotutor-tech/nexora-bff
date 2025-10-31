// import type { TestingModule } from '@nestjs/testing'
// import { Test } from '@nestjs/testing'
// import { MqttController } from './mqtt.controller'
// import { MqttService } from './mqtt.service'
//
// describe('MqttController', () => {
//   let controller: MqttController
//   let service: MqttService
//
//   beforeEach(async () => {
//     jest.clearAllMocks()
//
//     service = {
//       validateAuthToken: jest.fn(),
//       validateAcl: jest.fn()
//     } as unknown as MqttService
//
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [MqttController],
//       providers: [{ provide: MqttService, useValue: service }]
//     }).compile()
//
//     controller = module.get<MqttController>(MqttController)
//   })
//
//   it('should be defined', () => {
//     expect(controller).toBeDefined()
//   })
//     it('should call webclient.get with auth validate path + Authorization header and return allow with internal_id', async () => {
//   describe('validateMqttToken', () => {
//     it('should delegate to mqttService.validateAuthToken and return response', async () => {
//
//       const dto = { password: 'Bearer tkn' }
//       expect(service.validateAuthToken).toHaveBeenCalledTimes(1)
//       expect(service.validateAuthToken).toHaveBeenCalledWith(dto)
//     })
//   })
//       const result = await controller.authenticate(dto )
//   describe('validateAcl', () => {
//     it('should delegate to mqttService.validateAcl and return response', async () => {
//       const result = await service.validateAuthToken(req )
//       const resp = { result: 'allow' as const }
//
//       jest.spyOn(service, 'validateAcl').mockResolvedValueOnce(resp)
//
//       const result = await controller.authorize(dto)
//
//       const dto = { username: 'alice' }
//       expect(result.result).toBe('allow')
//       expect(result.client_attrs?.internal_id).toEqual(expect.any(String))
