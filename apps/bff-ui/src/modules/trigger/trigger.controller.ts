import { Controller, Post, Body, UsePipes, Get } from '@nestjs/common'
import { TriggerService } from './trigger.service'
import { Trigger } from './types/trigger'
import { CreateTriggerSchema } from './schema/createTrigger.schema'
import { CreateTriggerDto } from './dto/CreateTrigger.dto'
import { ZodValidationPipe } from '@shared'

@Controller('triggers')
export class TriggerController {
  constructor(private readonly triggerService: TriggerService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateTriggerSchema))
  createTrigger(@Body() createTriggerDto: CreateTriggerDto): Promise<Trigger> {
    return this.triggerService.createTrigger(createTriggerDto)
  }

  @Get()
  getAllTriggers(): Promise<Trigger[]> {
    return this.triggerService.getAllTriggers()
  }
}
