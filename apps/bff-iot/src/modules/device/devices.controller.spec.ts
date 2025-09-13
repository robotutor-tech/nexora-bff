import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import type { DeviceInvitation } from './types/device';

describe('DevicesController', () => {
  let controller: DevicesController;
  let service: DevicesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    service = {
      registerDevice: jest.fn(),
    } as unknown as DevicesService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
      providers: [{ provide: DevicesService, useValue: service }],
    }).compile();

    controller = module.get<DevicesController>(DevicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerDevices', () => {
    it('should delegate to devicesService.registerDevice and return invitation', async () => {
      const dto = { serialNo: 'S-1', modelNo: 'M-100', type: 'DEVICE' };
      const invitation: DeviceInvitation = {
        token: 'tkn',
        name: 'Thermostat',
        invitationId: 'i-1',
        modelNo: 'M-100',
      };

      jest.spyOn(service, 'registerDevice').mockResolvedValueOnce(invitation);

      const result = await controller.registerDevices(dto );

      expect(result).toStrictEqual(invitation);
      expect(service.registerDevice).toHaveBeenCalledTimes(1);
      expect(service.registerDevice).toHaveBeenCalledWith(dto);
    });
  });
});
