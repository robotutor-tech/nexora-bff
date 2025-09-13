import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { WidgetsService } from './widgets.service'
import { Webclient, apiConfig } from '@shared'
import type { Widget } from './types/widget'

describe('WidgetsService', () => {
  let service: WidgetsService
  let webclient: Webclient

  beforeEach(async () => {
    jest.clearAllMocks()

    webclient = {
      get: jest.fn()
    } as unknown as Webclient

    const module: TestingModule = await Test.createTestingModule({
      providers: [WidgetsService, { provide: Webclient, useValue: webclient }]
    }).compile()

    service = module.get<WidgetsService>(WidgetsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAllWidgets', () => {
    it('should call webclient.get with baseUrl and empty path and return widgets', async () => {
      const widgets: Widget[] = [
        {
          widgetId: 'w-1',
          zoneId: 'z-1',
          premisesId: 'p-1',
          feedId: 'f-1',
          name: 'Temperature',
          createdAt: new Date('2023-01-01T00:00:00Z')
        }
      ]

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(widgets)

      const result = await service.getAllWidgets()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.widget.baseUrl, path: '' })
      expect(result).toBe(widgets)
    })
  })
})
