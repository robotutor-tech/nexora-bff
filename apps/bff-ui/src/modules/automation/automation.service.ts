import { Injectable } from '@nestjs/common'
import { Automation } from './types/automation'
import { CreateAutomationRequest } from './dto/CreateAutomation.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class AutomationService {
  private readonly automationConfig = apiConfig.automation

  constructor(private readonly webclient: Webclient) {}

  createAutomation(createAutomationRequest: CreateAutomationRequest): Promise<Automation> {
    return this.webclient.post<Automation>({
      baseUrl: this.automationConfig.baseUrl,
      path: this.automationConfig.automations,
      body: createAutomationRequest
    })
  }

  getAllAutomations(): Promise<Automation[]> {
    return this.webclient.get<Automation[]>({
      baseUrl: this.automationConfig.baseUrl,
      path: this.automationConfig.automations
    })
  }
}
