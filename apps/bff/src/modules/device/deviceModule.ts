import { Module } from '@nestjs/common'
import { DeviceService } from './device.service'
import { DeviceController } from './device.controller'
import { WebclientModule } from '@shared'
import { IamModule } from '../iam/iam.module'
import { RequestContextModule } from '@shared/service/requestContext.module'

@Module({
  imports: [RequestContextModule, WebclientModule, IamModule],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService]
})
export class DeviceModule {}
