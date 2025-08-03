import { Controller, Post, Body, UsePipes, Get } from '@nestjs/common'
import { AutomationService } from './automation.service'
import { Automation } from './types/automation'
import { CreateAutomationSchema } from './schema/createAutomation.schema'
import { CreateAutomationDto } from './dto/CreateAutomation.dto'
import { ZodValidationPipe } from '@shared'

@Controller('automations')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateAutomationSchema))
  createAutomation(@Body() createAutomationDto: CreateAutomationDto): Promise<Automation> {
    return this.automationService.createAutomation(createAutomationDto)
  }

  @Get()
  getAllAutomations(): Promise<Automation[]> {
    return this.automationService.getAllAutomations()
  }
}
