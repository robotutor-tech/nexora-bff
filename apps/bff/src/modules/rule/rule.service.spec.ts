import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { RuleService } from './rule.service'
import { Webclient, apiConfig } from '@shared'
import type { Rule } from './types/rule'

describe('RuleService', () => {
  let service: RuleService
  let webclient: Webclient

  beforeEach(async () => {
    jest.clearAllMocks()

    webclient = {
      post: jest.fn(),
      get: jest.fn()
    } as unknown as Webclient

    const module: TestingModule = await Test.createTestingModule({
      providers: [RuleService, { provide: Webclient, useValue: webclient }]
    }).compile()

    service = module.get<RuleService>(RuleService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createRule', () => {
    it('should POST to rules path and return created rule', async () => {
      const req = { name: 'My Rule', type: 'TRIGGER', config: { type: 'VOICE', commands: ['turn on'] } }
      const rule: Rule = { ruleId: 'r-1', name: 'My Rule', type: 'TRIGGER', config: { type: 'VOICE', commands: ['turn on'] } }

      jest.spyOn(webclient, 'post').mockResolvedValueOnce(rule)

      const result = await service.createRule(req )

      expect(webclient.post).toHaveBeenCalledTimes(1)
      expect(webclient.post).toHaveBeenCalledWith({ baseUrl: apiConfig.rule.baseUrl, path: apiConfig.rule.rules, body: req })
      expect(result).toBe(rule)
    })
  })

  describe('getAllRules', () => {
    it('should GET rules and return list', async () => {
      const rules: Rule[] = [
        { ruleId: 'r-1', name: 'My Rule', type: 'TRIGGER', config: { type: 'VOICE', commands: ['do'] } }
      ]

      jest.spyOn(webclient, 'get').mockResolvedValueOnce(rules)

      const result = await service.getAllRules()

      expect(webclient.get).toHaveBeenCalledTimes(1)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.rule.baseUrl, path: apiConfig.rule.rules })
      expect(result).toBe(rules)
    })
  })
})
