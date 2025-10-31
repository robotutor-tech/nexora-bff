import { Module } from '@nestjs/common'
import { AutomationService } from './automation.service'
import { AutomationController } from './automation.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [AutomationController],
  providers: [AutomationService]
})
export class AutomationModule {}
