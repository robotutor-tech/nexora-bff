import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { WidgetsController } from './widgets.controller'
import { WidgetsService } from './widgets.service'
import type { Widget } from './types/widget'

describe('WidgetsController', () => {
  let controller: WidgetsController
  let service: WidgetsService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = {
      getAllWidgets: jest.fn()
    } as unknown as WidgetsService

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WidgetsController],
      providers: [{ provide: WidgetsService, useValue: service }]
    }).compile()

    controller = module.get(WidgetsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllWidgets', () => {
    it('should delegate to widgetsService.getAllWidgets and return the result', async () => {
      const widgets: Widget[] = [
        {
          widgetId: 'w-1',
          zoneId: 'z-1',
          premisesId: 'p-1',
          feedId: 'f-1',
          name: 'Temperature',
          createdAt: new Date('2023-01-01T00:00:00Z')
        },
        {
          widgetId: 'w-2',
          zoneId: 'z-2',
          premisesId: 'p-2',
          feedId: 'f-2',
          name: 'Humidity',
          createdAt: new Date('2023-01-02T00:00:00Z')
        }
      ]

      jest.spyOn(service, 'getAllWidgets').mockResolvedValueOnce(widgets)

      const result = await controller.getAllWidgets()

      expect(result).toStrictEqual(widgets)
      expect(service.getAllWidgets).toHaveBeenCalledTimes(1)
      expect(service.getAllWidgets).toHaveBeenCalledWith()
    })
  })
})
