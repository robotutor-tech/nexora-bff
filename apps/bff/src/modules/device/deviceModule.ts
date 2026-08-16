import { Module } from '@nestjs/common'
import { DeviceService } from './device.service'
import { DeviceController } from './device.controller'
import { WebclientModule } from '@shared'
import { identityModule } from '../identity/identity.module'
import { RequestContextModule } from '@shared/service/requestContext.module'
import { FeedsModule } from '../feed/feeds.module'

@Module({
  imports: [RequestContextModule, WebclientModule, identityModule, FeedsModule],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService]
})
export class DeviceModule {}
