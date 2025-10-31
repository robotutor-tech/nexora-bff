import { Injectable } from '@nestjs/common'
import { Rule } from './types/rule'
import { CreateRuleRequest } from './dto/CreateRule.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class RuleService {
  private readonly ruleConfig = apiConfig.rule

  constructor(private readonly webclient: Webclient) {}

  createRule(createRuleRequest: CreateRuleRequest): Promise<Rule> {
    return this.webclient.post<Rule>({
      baseUrl: this.ruleConfig.baseUrl,
      path: this.ruleConfig.rules,
      body: createRuleRequest
    })
  }

  getAllRules(): Promise<Rule[]> {
    return this.webclient.get<Rule[]>({
      baseUrl: this.ruleConfig.baseUrl,
      path: this.ruleConfig.rules
    })
  }
}
