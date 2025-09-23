// import type { TestingModule } from '@nestjs/testing'
// import { Test } from '@nestjs/testing'
// import { MqttService } from './mqtt.service'
// import { Webclient, apiConfig } from '@shared'
// import type { ValidatedResponse } from './types/mqtt'
//
// describe('MqttService', () => {
//   let service: MqttService
//   let webclient: Webclient
//
//   beforeEach(async () => {
//     jest.clearAllMocks()
//
//     webclient = {
//       get: jest.fn()
//     } as unknown as Webclient
//
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [MqttService, { provide: Webclient, useValue: webclient }]
//     }).compile()
//
//     service = module.get<MqttService>(MqttService)
//   })
//
//   it('should be defined', () => {
//     expect(service).toBeDefined()
//   })
//
//   describe('validateAuthToken', () => {
//     it('calls webclient.get with validate path + Authorization header and returns allow with Server internal_id', async () => {
//       const req = { password: 'Bearer jwt' }
//       const resp: ValidatedResponse = {
//         isValid: true,
//         principalType: 'SERVER',
//         principal: { serverId: 'srv-1' },
//         expiresAt: new Date()
//       }
//
//       jest.spyOn(webclient, 'get').mockResolvedValueOnce(resp)
//
//       const result = await service.validateAuthToken(req)
//
//       expect(webclient.get).toHaveBeenCalledTimes(1)
//       expect(webclient.get).toHaveBeenCalledWith({
//         baseUrl: apiConfig.auth.baseUrl,
//         path: apiConfig.auth.validate,
//         headers: { Authorization: req.password }
//       })
//       expect(result).toEqual({ result: 'allow', client_attrs: { internal_id: 'Server:srv-1' } })
//     })
//
//     it('returns allow with User internal_id when principalType is USER', async () => {
//       const req = { password: 'Bearer jwt' }
//       const resp: ValidatedResponse = {
//         isValid: true,
//         principalType: 'USER',
//         principal: { userId: 'usr-9' },
//         expiresAt: new Date()
//       }
//       jest.spyOn(webclient, 'get').mockResolvedValueOnce(resp)
//
//       const result = await service.validateAuthToken(req)
//
//       expect(result).toEqual({ result: 'allow', client_attrs: { internal_id: 'User:usr-9' } })
//     })
//
//     it('returns allow with Actor internal_id when principalType is ACTOR', async () => {
//       const req = { password: 'Bearer jwt' }
//       const resp: ValidatedResponse = {
//         isValid: true,
//         principalType: 'ACTOR',
//         principal: { actorId: 'act-3', roleId: 'role-7' },
//         expiresAt: new Date()
//       }
//       jest.spyOn(webclient, 'get').mockResolvedValueOnce(resp)
//
//       const result = await service.validateAuthToken(req)
//
//       expect(result).toEqual({ result: 'allow', client_attrs: { internal_id: 'Actor:act-3_role-7' } })
//     })
//
//     it('should return deny if webclient.get throws', async () => {
//       const req = { password: 'Bearer bad' }
//       jest.spyOn(webclient, 'get').mockRejectedValueOnce(new Error('fail'))
//
//       const result = await service.validateAuthToken(req)
//
//       expect(webclient.get).toHaveBeenCalledTimes(1)
//       expect(result).toEqual({ result: 'deny' })
//     })
//   })
//
//   describe('validateAcl', () => {
//     it('should return allow for any input', async () => {
//       const req = { username: 'alice' }
//       const result = await service.validateAcl(req as any)
//       expect(result).toEqual({ result: 'allow' })
//     })
//   })
// })
