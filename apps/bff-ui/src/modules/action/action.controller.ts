import { Controller, Post, Body, UsePipes, Get } from '@nestjs/common'
import { ActionService } from './action.service'
import { Action } from './types/action'
import { CreateActionSchema } from './schema/createAction.schema'
import { CreateActionDto } from './dto/CreateAction.dto'
import { ZodValidationPipe } from '@shared'

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateActionSchema))
  createAction(@Body() createActionDto: CreateActionDto): Promise<Action> {
    return this.actionService.createAction(createActionDto)
  }

  @Get()
  getAllActions(): Promise<Action[]> {
    return this.actionService.getAllActions()
  }
}
