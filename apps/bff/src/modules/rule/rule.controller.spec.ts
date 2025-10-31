import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { RuleController } from './rule.controller'
import { RuleService } from './rule.service'
import type { Rule } from './types/rule'

describe('RuleController', () => {
  let controller: RuleController
  let service: RuleService

  beforeEach(async () => {
    jest.clearAllMocks()

    service = {
      createRule: jest.fn(),
      getAllRules: jest.fn()
    } as unknown as RuleService

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuleController],
      providers: [{ provide: RuleService, useValue: service }]
    }).compile()

    controller = module.get<RuleController>(RuleController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('createRule', () => {
    it('should delegate to ruleService.createRule and return the created rule', async () => {
      const dto = {
        name: 'My Rule',
        type: 'TRIGGER',
        config: { type: 'VOICE', commands: ['turn on'] }
      }
      const rule: Rule = {
        ruleId: 'r-1',
        name: 'My Rule',
        type: 'TRIGGER',
        config: { type: 'VOICE', commands: ['turn on'] }
      }

      jest.spyOn(service, 'createRule').mockResolvedValueOnce(rule)

      const result = await controller.createRule(dto)

      expect(result).toStrictEqual(rule)
      expect(service.createRule).toHaveBeenCalledTimes(1)
      expect(service.createRule).toHaveBeenCalledWith(dto)
    })
  })

  describe('getAllRules', () => {
    it('should delegate to ruleService.getAllRules and return the result', async () => {
      const rules: Rule[] = [
        {
          ruleId: 'r-1',
          name: 'My Rule',
          type: 'TRIGGER',
          config: { type: 'VOICE', commands: ['do'] }
        }
      ]

      jest.spyOn(service, 'getAllRules').mockResolvedValueOnce(rules)

      const result = await controller.getAllRules()

      expect(result).toStrictEqual(rules)
      expect(service.getAllRules).toHaveBeenCalledTimes(1)
      expect(service.getAllRules).toHaveBeenCalledWith()
    })
  })
})
