import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { ZonesController } from './zones.controller'
import { ZonesService } from './zones.service'
import type { Zone } from './types/zone'

describe('ZonesController', () => {
  let controller: ZonesController
  let service: ZonesService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = {
      create: jest.fn(),
      getAllZones: jest.fn()
    } as unknown as ZonesService

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZonesController],
      providers: [{ provide: ZonesService, useValue: service }]
    }).compile()

    controller = module.get(ZonesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('createZone', () => {
    it('should delegate to zonesService.create and return the created zone', async () => {
      const dto = { name: 'Living Room' }
      const zone: Zone = {
        zoneId: 'z-1',
        name: 'Living Room',
        premisesId: 'p-1',
        createdAt: new Date('2023-01-01T00:00:00Z')
      }

      jest.spyOn(service, 'create').mockResolvedValueOnce(zone)

      const result = await controller.createZone(dto)

      expect(result).toStrictEqual(zone)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(service.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('getAllZones', () => {
    it('should delegate to zonesService.getAllZones and return the result', async () => {
      const zones: Zone[] = [
        {
          zoneId: 'z-1',
          name: 'Living Room',
          premisesId: 'p-1',
          createdAt: new Date('2023-01-01T00:00:00Z')
        },
        {
          zoneId: 'z-2',
          name: 'Bedroom',
          premisesId: 'p-1',
          createdAt: new Date('2023-01-02T00:00:00Z')
        }
      ]

      jest.spyOn(service, 'getAllZones').mockResolvedValueOnce(zones)

      const result = await controller.getAllZones()

      expect(result).toStrictEqual(zones)
      expect(service.getAllZones).toHaveBeenCalledTimes(1)
      expect(service.getAllZones).toHaveBeenCalledWith()
    })
  })
})
