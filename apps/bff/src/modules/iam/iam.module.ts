import { Module } from '@nestjs/common'
import { IamService } from './iam.service'
import { IamController } from './iam.controller'
import { WebclientModule } from '@shared'
import { ActorController } from './actor.controller'
import { ActorService } from './actor.service'

@Module({
  imports: [WebclientModule],
  controllers: [IamController, ActorController],
  providers: [IamService, ActorService]
})
export class IamModule {}
