import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AutomationService } from './automation.service'
import { Webclient, apiConfig } from '@shared'
import type { Automation } from './types/automation'
import type { CreateAutomationRequest } from './dto/CreateAutomation.dto'

describe('AutomationService', () => {
  let service: AutomationService
  let webclient: Webclient

  beforeEach(async () => {
    jest.clearAllMocks()

    webclient = {
      post: jest.fn(),
      get: jest.fn()
    } as unknown as Webclient

    const module: TestingModule = await Test.createTestingModule({
      providers: [AutomationService, { provide: Webclient, useValue: webclient }]
    }).compile()

    service = module.get<AutomationService>(AutomationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createAutomation', () => {
    it('should call webclient.post with baseUrl and automations path and return automation', async () => {
      const req: CreateAutomationRequest = {
        name: 'Morning Lights',
        config: { type: 'TIME_RANGE', startTime: '06:00', endTime: '07:00' }
      }
      const automation: Automation = {
        automationId: 'a-1',
        name: 'Morning Lights',
        triggers: [],
        actions: [],
        description: 'desc'
      }

      jest.spyOn(webclient, 'post').mockResolvedValueOnce(automation)

      const result = await service.createAutomation(req)

      expect(webclient.post).toHaveBeenCalledTimes(1)
      expect(webclient.post).toHaveBeenCalledWith({
        baseUrl: apiConfig.automation.baseUrl,
        path: apiConfig.automation.automations,
        body: req
      })
      expect(result).toBe(automation)
    })
  })

  describe('getAllAutomations', () => {
    it('should call webclient.get with baseUrl and automations path and return automations', async () => {
      const automations: Automation[] = [
        { automationId: 'a-1', name: 'Morning Lights', triggers: [], actions: [], description: 'desc' }
      ]

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(automations)

      const result = await service.getAllAutomations()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({
        baseUrl: apiConfig.automation.baseUrl,
        path: apiConfig.automation.automations
      })
      expect(result).toBe(automations)
    })
  })
})
