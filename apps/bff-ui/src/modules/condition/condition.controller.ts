import { Controller, Post, Body, UsePipes, Get } from '@nestjs/common'
import { ConditionService } from './condition.service'
import { Condition } from './types/condition'
import { CreateConditionSchema } from './schema/createCondition.schema'
import { CreateConditionDto } from './dto/CreateCondition.dto'
import { ZodValidationPipe } from '@shared'

@Controller('conditions')
export class ConditionController {
  constructor(private readonly conditionService: ConditionService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateConditionSchema))
  createCondition(@Body() createConditionDto: CreateConditionDto): Promise<Condition> {
    return this.conditionService.createCondition(createConditionDto)
  }

  @Get()
  getAllConditions(): Promise<Condition[]> {
    return this.conditionService.getAllConditions()
  }
}
