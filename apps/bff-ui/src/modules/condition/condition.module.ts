import { Module } from '@nestjs/common'
import { ConditionService } from './condition.service'
import { ConditionController } from './condition.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [ConditionController],
  providers: [ConditionService]
})
export class ConditionModule {}
