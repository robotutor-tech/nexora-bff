import { Test, TestingModule } from '@nestjs/testing';
import { PremisesController } from './premises.controller';
import { PremisesService } from './premises.service';

describe('PremisesController', () => {
  let controller: PremisesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PremisesController],
      providers: [PremisesService],
    }).compile();

    controller = module.get<PremisesController>(PremisesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
