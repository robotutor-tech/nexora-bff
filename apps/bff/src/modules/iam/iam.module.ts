import { Module } from '@nestjs/common'
import { IamService } from './iam.service'
import { IamController } from './iam.controller'
import { WebclientModule } from '@shared'
import { ActorController } from './actor.controller'
import { ActorService } from './actor.service'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'

@Module({
  imports: [WebclientModule],
  controllers: [IamController, ActorController, AccountController],
  providers: [IamService, ActorService, AccountService]
})
export class IamModule {}
