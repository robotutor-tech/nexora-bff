import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PremisesService } from './premises.service';
import { Webclient, apiConfig } from '@shared';
import type { Premises, PremisesWithActors } from './types/premises';

describe('PremisesService', () => {
  let service: PremisesService;
  let webclient: Webclient;

  beforeEach(async () => {
    jest.clearAllMocks();

    webclient = {
      post: jest.fn(),
      get: jest.fn(),
    } as unknown as Webclient;

    const module: TestingModule = await Test.createTestingModule({
      providers: [PremisesService, { provide: Webclient, useValue: webclient }],
    }).compile();

    service = module.get(PremisesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPremises', () => {
    it('should POST to premises path and return created premises with actors', async () => {
      const req = {
          name: 'Home',
          address: {
            street: '1',
            city: 'c',
            state: 's',
            country: 'i',
            postalCode: '12345',
          },
        },
        resp: PremisesWithActors = {
          premisesId: 'p-1',
          name: 'Home',
          createdAt: new Date('2023-01-01T00:00:00Z'),
          actor: [],
        };

      jest.spyOn(webclient, 'post').mockResolvedValueOnce(resp);

      const result = await service.createPremises(req );

      expect(webclient.post).toHaveBeenCalledTimes(1);
      expect(webclient.post).toHaveBeenCalledWith({
        baseUrl: apiConfig.premises.baseUrl,
        path: apiConfig.premises.premises,
        body: req,
      });
      expect(result).toBe(resp);
    });
  });

  describe('getAllPremises', () => {
    it('should GET premises list and return it', async () => {
      const list: PremisesWithActors[] = [
        {
          premisesId: 'p-1',
          name: 'Home',
          createdAt: new Date('2023-01-01T00:00:00Z'),
          actor: [],
        },
      ];

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(list);

      const result = await service.getAllPremises();

      expect(webclient.get).toHaveBeenCalledTimes(1);
      expect(webclient.get).toHaveBeenCalledWith({
        baseUrl: apiConfig.premises.baseUrl,
        path: apiConfig.premises.premises,
      });
      expect(result).toBe(list);
    });
  });

  describe('getPremises', () => {
    it('should GET premises details by premisesId and return it', async () => {
      const premises: Premises = {
        premisesId: '1',
        name: 'Home',
        createdAt: new Date('2023-01-01T00:00:00Z'),
      };

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(premises);

      const result = await service.getPremises('1');

      expect(webclient.get).toHaveBeenCalledTimes(1);
      expect(webclient.get).toHaveBeenCalledWith({
        baseUrl: apiConfig.premises.baseUrl,
        path: apiConfig.premises.premisesDetails,
        uriVariables: { premisesId: '1' },
      });
      expect(result).toBe(premises);
    });
  });
});
