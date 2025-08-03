import { Module } from '@nestjs/common'
import { ActionService } from './action.service'
import { ActionController } from './action.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [ActionController],
  providers: [ActionService]
})
export class ActionModule {}
