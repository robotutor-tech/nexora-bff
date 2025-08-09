import { Controller, Post, Body, UsePipes } from '@nestjs/common'
import { DevicesService } from './devices.service'
import { DeviceInvitation } from './types/device'
import { RegisterDeviceDto } from './dto/register-device.dto'
import { RegisterDeviceSchema } from './schema/registerDevice.schema'
import { ZodValidationPipe } from '@shared'

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterDeviceSchema))
  registerDevices(@Body() registerDeviceDto: RegisterDeviceDto): Promise<DeviceInvitation> {
    return this.devicesService.registerDevice(registerDeviceDto)
  }
}
