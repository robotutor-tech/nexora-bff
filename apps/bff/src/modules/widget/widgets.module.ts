import { Module } from '@nestjs/common'
import { WidgetsService } from './widgets.service'
import { WidgetsController } from './widgets.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [WidgetsController],
  providers: [WidgetsService]
})
export class WidgetsModule {}
