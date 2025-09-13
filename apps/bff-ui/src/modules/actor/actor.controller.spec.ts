import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';
import type { Actor } from './types/actor';

describe('ActorController', () => {
  let controller: ActorController;
  let service: ActorService;

  beforeEach(async () => {
    jest.clearAllMocks();

    service = {
      getCurrentActor: jest.fn(),
    } as unknown as ActorService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActorController],
      providers: [{ provide: ActorService, useValue: service }],
    }).compile();

    controller = module.get(ActorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrentActor', () => {
    it('should delegate to actorService.getCurrentActor and return the result', async () => {
      const actor: Actor = {
        actorId: 'a-1',
        premisesId: 'p-1',
        role: { roleId: 'r-1', name: 'Admin', roleType: 'ADMIN' },
      };

      jest.spyOn(service, 'getCurrentActor').mockResolvedValueOnce(actor);

      const result = await controller.getCurrentActor();

      expect(result).toStrictEqual(actor);
      expect(service.getCurrentActor).toHaveBeenCalledTimes(1);
      expect(service.getCurrentActor).toHaveBeenCalledWith();
    });
  });
});
