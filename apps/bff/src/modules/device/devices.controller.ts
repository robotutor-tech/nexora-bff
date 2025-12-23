import { Controller, Get, Post, Body, UsePipes, Res } from '@nestjs/common'
import { DeviceService } from './device.service'
import { Device, DeviceFirmwareResponse, DeviceResponse } from './types/device'
import { ZodValidationPipe } from '@shared'
import { RegisterDeviceDto } from './dto/register-device.dto'
import type { Response } from 'express'
import * as path from 'path'
import { RegisterDeviceSchema } from './schema/registerDevice.schema'

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DeviceService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterDeviceSchema))
  registerDevice(@Body() registerDeviceDto: RegisterDeviceDto): Promise<DeviceResponse> {
    return this.devicesService.registerDevice(registerDeviceDto)
  }

  @Get()
  getAllDevices(): Promise<Device[]> {
    return this.devicesService.getAllDevices()
  }

  @Get('me')
  getDevice(): Promise<Device> {
    return this.devicesService.getCurrentDevice()
  }

  @Get('firmware')
  getDeviceFirmware(): Promise<DeviceFirmwareResponse> {
    return this.devicesService.getDeviceFirmware()
  }

  @Get('firmware.bin')
  updateBin(@Res() res: Response): void {
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', 'attachment; filename="firmware.bin"')

    const path1 = path.join(__dirname, '..', '../../apps/bff/src/modules/device/firmware.bin')
    res.sendFile(path1)
    // const data = fs.readFileSync(path1)
  }
}
