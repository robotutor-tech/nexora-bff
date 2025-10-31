import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { ActorService } from './actor.service'
import { Webclient, apiConfig } from '@shared'
import type { Actor } from './types/actor'

describe('ActorService', () => {
  let service: ActorService
  let webclient: Webclient

  beforeEach(async () => {
    jest.clearAllMocks()

    webclient = {
      get: jest.fn()
    } as unknown as Webclient

    const module: TestingModule = await Test.createTestingModule({
      providers: [ActorService, { provide: Webclient, useValue: webclient }]
    }).compile()

    service = module.get<ActorService>(ActorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getCurrentActor', () => {
    it('should call webclient.get with baseUrl and me path and return current actor', async () => {
      const actor: Actor = {
        actorId: 'a-1',
        premisesId: 'p-1',
        role: { roleId: 'r-1', name: 'Admin', roleType: 'ADMIN' }
      }

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(actor)

      const result = await service.getCurrentActor()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.actor.baseUrl, path: apiConfig.actor.me })
      expect(result).toBe(actor)
    })
  })
})
