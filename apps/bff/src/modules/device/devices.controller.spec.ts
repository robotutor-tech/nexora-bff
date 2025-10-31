import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { DevicesController } from './devices.controller'
import { DevicesService } from './devices.service'
import type { Device, DeviceInvitation } from './types/device'

describe('DevicesController', () => {
  let controller: DevicesController
  let service: DevicesService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = {
      createDeviceInvitation: jest.fn(),
      getAllDevices: jest.fn(),
      getAllDevicesInvitations: jest.fn()
    } as unknown as DevicesService

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
      providers: [{ provide: DevicesService, useValue: service }]
    }).compile()

    controller = module.get<DevicesController>(DevicesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('createDeviceInvitation', () => {
    it('should delegate to devicesService.createDeviceInvitation and return the invitation', async () => {
      const dto = { name: 'Sensor', zoneId: 'z-1' }
      const invitation: DeviceInvitation = {
        token: 'tkn',
        name: 'Sensor',
        invitationId: 'i-1',
        modelNo: 'M-100'
      }

      jest.spyOn(service, 'createDeviceInvitation').mockResolvedValueOnce(invitation)

      const result = await controller.createDeviceInvitation(dto )

      expect(result).toStrictEqual(invitation)
      expect(service.createDeviceInvitation).toHaveBeenCalledTimes(1)
      expect(service.createDeviceInvitation).toHaveBeenCalledWith(dto)
    })
  })

  describe('getAllDevices', () => {
    it('should delegate to devicesService.getAllDevices and return devices', async () => {
      const devices: Device[] = [
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

      jest.spyOn(service, 'getAllDevices').mockResolvedValueOnce(devices)

      const result = await controller.getAllDevices()

      expect(result).toStrictEqual(devices)
      expect(service.getAllDevices).toHaveBeenCalledTimes(1)
      expect(service.getAllDevices).toHaveBeenCalledWith()
    })
  })

  describe('getAllDevicesInvitations', () => {
    it('should delegate to devicesService.getAllDevicesInvitations and return invitations', async () => {
      const invitations: DeviceInvitation[] = [
        { token: 'tkn', name: 'Sensor', invitationId: 'i-1', modelNo: 'M-100' }
      ]

      jest.spyOn(service, 'getAllDevicesInvitations').mockResolvedValueOnce(invitations)

      const result = await controller.getAllDevicesInvitations()

      expect(result).toStrictEqual(invitations)
      expect(service.getAllDevicesInvitations).toHaveBeenCalledTimes(1)
      expect(service.getAllDevicesInvitations).toHaveBeenCalledWith()
    })
  })
})
