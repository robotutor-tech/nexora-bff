import { Controller, Post, Body, UsePipes, Get } from '@nestjs/common'
import { RuleService } from './rule.service'
import { Rule } from './types/rule'
import { CreateRuleSchema } from './schema/createRule.schema'
import { CreateRuleDto } from './dto/CreateRule.dto'
import { ZodValidationPipe } from '@shared'

@Controller('rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateRuleSchema))
  createRule(@Body() createRuleDto: CreateRuleDto): Promise<Rule> {
    return this.ruleService.createRule(createRuleDto)
  }

  @Get()
  getAllRules(): Promise<Rule[]> {
    return this.ruleService.getAllRules()
  }
}
