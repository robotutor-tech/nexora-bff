import { Module } from '@nestjs/common'
import { DeviceService } from './device.service'
import { DeviceController } from './device.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService]
})
export class DeviceModule {}
