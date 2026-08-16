import { Module } from '@nestjs/common'
import { identityService } from './identity.service'
import { identityController } from './identity.controller'
import { WebclientModule } from '@shared'
import { ActorController } from './actor.controller'
import { ActorService } from './actor.service'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'

@Module({
  imports: [WebclientModule],
  controllers: [identityController, ActorController, AccountController],
  providers: [identityService, ActorService, AccountService],
  exports: [ActorService, AccountService, identityService]
})
export class identityModule {}
