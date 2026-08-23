import { Module } from '@nestjs/common'
import { IdentityService } from './identity.service'
import { identityController } from './identity.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [identityController],
  providers: [IdentityService],
  exports: [IdentityService]
})
export class identityModule {}
