import { Module } from '@nestjs/common'
import { DeviceService } from './device.service'
import { DevicesController } from './devices.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [DevicesController],
  providers: [DeviceService],
  exports: [DeviceService]
})
export class DeviceModule {}
