import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { FeedsController } from './feeds.controller'
import { FeedsService } from './feeds.service'
import type { Feed } from './types/feed'

describe('FeedsController', () => {
  let controller: FeedsController
  let service: FeedsService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = {
      getAllFeeds: jest.fn(),
    } as unknown as FeedsService

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedsController],
      providers: [{ provide: FeedsService, useValue: service }],
    }).compile()

    controller = module.get<FeedsController>(FeedsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllFeeds', () => {
    it('should delegate to feedsService.getAllFeeds and return feeds', async () => {
      const feeds: Feed[] = [
        { feedId: 'f-1', premisesId: 'p-1', name: 'Temperature', value: 24.5 },
      ]
      jest.spyOn(service, 'getAllFeeds').mockResolvedValueOnce(feeds)

      const result = await controller.getAllFeeds()

      expect(result).toStrictEqual(feeds)
      expect(service.getAllFeeds).toHaveBeenCalledTimes(1)
      expect(service.getAllFeeds).toHaveBeenCalledWith()
    })
  })
})
