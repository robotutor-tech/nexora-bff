import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { ZonesService } from './zones.service'
import { Webclient, apiConfig } from '@shared'
import type { Zone } from './types/zone'

describe('ZonesService', () => {
  let service: ZonesService
  let webclient: Webclient

  beforeEach(async () => {
    jest.clearAllMocks()

    webclient = {
      post: jest.fn(),
      get: jest.fn()
    } as unknown as Webclient

    const module: TestingModule = await Test.createTestingModule({
      providers: [ZonesService, { provide: Webclient, useValue: webclient }]
    }).compile()

    service = module.get<ZonesService>(ZonesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should call webclient.post with baseUrl and path and return created zone', async () => {
      const req = { name: 'Living Room' }
      const zone: Zone = {
        zoneId: 'z-1',
        name: 'Living Room',
        premisesId: 'p-1',
        createdAt: new Date('2023-01-01T00:00:00Z')
      }

      jest.spyOn(webclient, 'post').mockResolvedValueOnce(zone)

      const result = await service.create(req)

      expect(webclient.post).toHaveBeenCalledTimes(1)
      expect(webclient.post).toHaveBeenCalledWith({ baseUrl: apiConfig.zone.baseUrl, path: '', body: req })
      expect(result).toBe(zone)
    })
  })

  describe('getAllZones', () => {
    it('should call webclient.get with baseUrl and empty path and return zones', async () => {
      const zones: Zone[] = [
        { zoneId: 'z-1', name: 'Living Room', premisesId: 'p-1', createdAt: new Date('2023-01-01T00:00:00Z') }
      ]

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(zones)

      const result = await service.getAllZones()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.zone.baseUrl, path: '' })
      expect(result).toBe(zones)
    })
  })
})
