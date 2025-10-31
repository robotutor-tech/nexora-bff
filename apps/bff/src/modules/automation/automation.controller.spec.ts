import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AutomationController } from './automation.controller'
import { AutomationService } from './automation.service'
import type { Automation } from './types/automation'
import type { CreateAutomationDto } from './dto/CreateAutomation.dto'

describe('AutomationController', () => {
  let controller: AutomationController
  let service: AutomationService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = {
      createAutomation: jest.fn(),
      getAllAutomations: jest.fn()
    } as unknown as AutomationService

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutomationController],
      providers: [{ provide: AutomationService, useValue: service }]
    }).compile()

    controller = module.get(AutomationController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('createAutomation', () => {
    it('should delegate to automationService.createAutomation and return the created automation', async () => {
      const dto: CreateAutomationDto = {
        name: 'Morning Lights',
        config: { type: 'TIME_RANGE', startTime: '06:00', endTime: '07:00' }
      }
      const automation: Automation = {
        automationId: 'a-1',
        name: 'Morning Lights',
        description: 'desc',
        triggers: [],
        actions: []
      }

      jest.spyOn(service, 'createAutomation').mockResolvedValueOnce(automation)

      const result = await controller.createAutomation(dto)

      expect(result).toStrictEqual(automation)
      expect(service.createAutomation).toHaveBeenCalledTimes(1)
      expect(service.createAutomation).toHaveBeenCalledWith(dto)
    })
  })

  describe('getAllAutomations', () => {
    it('should delegate to automationService.getAllAutomations and return the result', async () => {
      const automations: Automation[] = [
        { automationId: 'a-1', name: 'Morning Lights', description: 'desc', triggers: [], actions: [] },
        { automationId: 'a-2', name: 'Night Lights', description: 'desc', triggers: [], actions: [] }
      ]

      jest.spyOn(service, 'getAllAutomations').mockResolvedValueOnce(automations)

      const result = await controller.getAllAutomations()

      expect(result).toStrictEqual(automations)
      expect(service.getAllAutomations).toHaveBeenCalledTimes(1)
      expect(service.getAllAutomations).toHaveBeenCalledWith()
    })
  })
})
