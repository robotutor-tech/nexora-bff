import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PremisesController } from './premises.controller';
import { PremisesService } from './premises.service';
import type { Premises, PremisesWithActors } from './types/premises';

describe('PremisesController', () => {
  let controller: PremisesController;
  let service: PremisesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    service = {
      createPremises: jest.fn(),
      getAllPremises: jest.fn(),
      getPremises: jest.fn(),
    } as unknown as PremisesService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PremisesController],
      providers: [{ provide: PremisesService, useValue: service }],
    }).compile();

    controller = module.get<PremisesController>(PremisesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPremises', () => {
    it('should delegate to premisesService.createPremises and return created premises with actors', async () => {
      const dto = {
        name: 'Home',
        address: {
          street: '1',
          city: 'c',
          state: 's',
          country: 'i',
          postalCode: '12345',
        },
      };
      const resp: PremisesWithActors = {
        premisesId: 'p-1',
        name: 'Home',
        createdAt: new Date('2023-01-01T00:00:00Z'),
        actor: [],
      };

      jest.spyOn(service, 'createPremises').mockResolvedValueOnce(resp);

      const result = await controller.createPremises(dto );

      expect(result).toStrictEqual(resp);
      expect(service.createPremises).toHaveBeenCalledTimes(1);
      expect(service.createPremises).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllPremises', () => {
    it('should delegate to premisesService.getAllPremises and return list', async () => {
      const list: PremisesWithActors[] = [
        {
          premisesId: 'p-1',
          name: 'Home',
          createdAt: new Date('2023-01-01T00:00:00Z'),
          actor: [],
        },
      ];

      jest.spyOn(service, 'getAllPremises').mockResolvedValueOnce(list);

      const result = await controller.getAllPremises();

      expect(result).toStrictEqual(list);
      expect(service.getAllPremises).toHaveBeenCalledTimes(1);
      expect(service.getAllPremises).toHaveBeenCalledWith();
    });
  });

  describe('getPremises', () => {
    it('should delegate to premisesService.getPremises and return a premises', async () => {
      const premises: Premises = {
        premisesId: '1',
        name: 'Home',
        createdAt: new Date('2023-01-01T00:00:00Z'),
      };

      jest.spyOn(service, 'getPremises').mockResolvedValueOnce(premises);

      const result = await controller.getPremises('1');

      expect(result).toStrictEqual(premises);
      expect(service.getPremises).toHaveBeenCalledTimes(1);
      expect(service.getPremises).toHaveBeenCalledWith('1');
    });
  });
});
