import { Module } from '@nestjs/common'
import { TriggerService } from './trigger.service'
import { TriggerController } from './trigger.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [TriggerController],
  providers: [TriggerService]
})
export class TriggerModule {}
