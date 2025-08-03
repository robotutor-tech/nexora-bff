import { Injectable } from '@nestjs/common'
import { Condition } from './types/condition'
import { CreateConditionRequest } from './dto/CreateCondition.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class ConditionService {
  private readonly conditionConfig = apiConfig.condition

  constructor(private readonly webclient: Webclient) {}

  createCondition(createConditionRequest: CreateConditionRequest): Promise<Condition> {
    return this.webclient.post<Condition>({
      baseUrl: this.conditionConfig.baseUrl,
      path: this.conditionConfig.conditions,
      body: createConditionRequest
    })
  }

  getAllConditions(): Promise<Condition[]> {
    return this.webclient.get<Condition[]>({
      baseUrl: this.conditionConfig.baseUrl,
      path: this.conditionConfig.conditions
    })
  }
}
