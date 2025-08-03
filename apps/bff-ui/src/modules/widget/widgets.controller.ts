import { Controller, Get } from '@nestjs/common'
import { WidgetsService } from './widgets.service'
import { Widget } from './types/widget'

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Get()
  getAllWidgets(): Promise<Widget[]> {
    return this.widgetsService.getAllWidgets()
  }
}
