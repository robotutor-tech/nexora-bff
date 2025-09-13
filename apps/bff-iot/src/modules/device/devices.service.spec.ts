
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DevicesService } from './devices.service';
import { Webclient, apiConfig } from '@shared';
import type { DeviceInvitation } from './types/device';

describe('DevicesService', () => {
  let service: DevicesService;
  let webclient: Webclient;

  beforeEach(async () => {
    jest.clearAllMocks();

    webclient = {
      post: jest.fn(),
    } as unknown as Webclient;

    const module: TestingModule = await Test.createTestingModule({
      providers: [DevicesService, { provide: Webclient, useValue: webclient }],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerDevice', () => {
    it('should POST to device baseUrl with empty path and return invitation', async () => {
      const req = { serialNo: 'S-1', modelNo: 'M-100', type: 'DEVICE' };
      const invitation: DeviceInvitation = {
        token: 'tkn',
        name: 'Thermostat',
        invitationId: 'i-1',
        modelNo: 'M-100',
      };

      jest.spyOn(webclient, 'post').mockResolvedValueOnce(invitation);

      const result = await service.registerDevice(req );

      expect(webclient.post).toHaveBeenCalledTimes(1);
      expect(webclient.post).toHaveBeenCalledWith({
        baseUrl: apiConfig.device.baseUrl,
        path: '',
        body: req,
      });
      expect(result).toBe(invitation);
    });
  });
});
