import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { DevicesService } from './devices.service'
import { Webclient, apiConfig } from '@shared'
import type { Device, DeviceInvitation } from './types/device'

describe('DevicesService', () => {
  let service: DevicesService
  let webclient: Webclient

  beforeEach(async () => {
    jest.clearAllMocks()

    webclient = {
      post: jest.fn(),
      get: jest.fn()
    } as unknown as Webclient

    const module: TestingModule = await Test.createTestingModule({
      providers: [DevicesService, { provide: Webclient, useValue: webclient }]
    }).compile()

    service = module.get<DevicesService>(DevicesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createDeviceInvitation', () => {
    it('should POST to auth deviceInvitation path and return invitation', async () => {
      const req = { name: 'Sensor', zoneId: 'z-1' }
      const invitation: DeviceInvitation = { token: 'tkn', name: 'Sensor', invitationId: 'i-1', modelNo: 'M-100' }

      jest.spyOn(webclient, 'post').mockResolvedValueOnce(invitation)

      const result = await service.createDeviceInvitation(req )

      expect(webclient.post).toHaveBeenCalledTimes(1)
      expect(webclient.post).toHaveBeenCalledWith({ baseUrl: apiConfig.iam.baseUrl, path: apiConfig.iam.deviceInvitation, body: req })
      expect(result).toBe(invitation)
    })
  })

  describe('getAllDevices', () => {
    it('should GET from device baseUrl and empty path and return devices', async () => {
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

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(devices)

      const result = await service.getAllDevices()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.device.baseUrl, path: '' })
      expect(result).toBe(devices)
    })
  })

  describe('getAllDevicesInvitations', () => {
    it('should GET from auth deviceInvitation path and return invitations', async () => {
      const invitations: DeviceInvitation[] = [
        { token: 'tkn', name: 'Sensor', invitationId: 'i-1', modelNo: 'M-100' }
      ]

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(invitations)

      const result = await service.getAllDevicesInvitations()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.iam.baseUrl, path: apiConfig.iam.deviceInvitation })
      expect(result).toBe(invitations)
    })
  })
})
