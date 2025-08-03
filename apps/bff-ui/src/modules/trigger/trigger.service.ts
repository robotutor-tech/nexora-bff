import { Injectable } from '@nestjs/common'
import { Trigger } from './types/trigger'
import { CreateTriggerRequest } from './dto/CreateTrigger.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class TriggerService {
  private readonly triggerConfig = apiConfig.trigger

  constructor(private readonly webclient: Webclient) {}

  createTrigger(createTriggerRequest: CreateTriggerRequest): Promise<Trigger> {
    return this.webclient.post<Trigger>({
      baseUrl: this.triggerConfig.baseUrl,
      path: this.triggerConfig.triggers,
      body: createTriggerRequest
    })
  }

  getAllTriggers(): Promise<Trigger[]> {
    return this.webclient.get<Trigger[]>({
      baseUrl: this.triggerConfig.baseUrl,
      path: this.triggerConfig.triggers
    })
  }
}
