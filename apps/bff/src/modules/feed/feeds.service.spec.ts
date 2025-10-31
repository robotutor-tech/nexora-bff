import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { FeedsService } from './feeds.service'
import { Webclient, apiConfig } from '@shared'
import type { Feed } from './types/feed'

describe('FeedsService', () => {
  let service: FeedsService
  let webclient: Webclient

  beforeEach(async () => {
    jest.clearAllMocks()

    webclient = {
      get: jest.fn()
    } as unknown as Webclient

    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedsService, { provide: Webclient, useValue: webclient }]
    }).compile()

    service = module.get<FeedsService>(FeedsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAllFeeds', () => {
    it('should call webclient.get with baseUrl and empty path and return feeds', async () => {
      const feeds: Feed[] = [{ feedId: 'f-1', premisesId: 'p-1', name: 'Temperature', value: 24.5 }]

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(feeds)

      const result = await service.getAllFeeds()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.feed.baseUrl, path: '' })
      expect(result).toBe(feeds)
    })
  })
})
