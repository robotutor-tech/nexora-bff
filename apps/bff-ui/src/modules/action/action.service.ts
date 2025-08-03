import { Injectable } from '@nestjs/common'
import { Action } from './types/action'
import { CreateActionRequest } from './dto/CreateAction.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class ActionService {
  private readonly actionConfig = apiConfig.action

  constructor(private readonly webclient: Webclient) {}

  createAction(createActionRequest: CreateActionRequest): Promise<Action> {
    return this.webclient.post<Action>({
      baseUrl: this.actionConfig.baseUrl,
      path: this.actionConfig.actions,
      body: createActionRequest
    })
  }

  getAllActions(): Promise<Action[]> {
    return this.webclient.get<Action[]>({
      baseUrl: this.actionConfig.baseUrl,
      path: this.actionConfig.actions
    })
  }
}
