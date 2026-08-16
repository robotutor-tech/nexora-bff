import { Controller, Get, Post, Body, UsePipes, Res } from '@nestjs/common'
import { DeviceService } from './device.service'
import { Device, DeviceFirmwareResponse, DeviceResponse, DeviceResponseForMachine } from './types/device'
import { ZodValidationPipe } from '@shared'
import { RegisterDeviceDto } from './dto/register-device.dto'
import type { Response } from 'express'
import * as path from 'path'
import { RegisterDeviceSchema } from './schema/registerDevice.schema'
import { CommissionDeviceSchema } from './schema/commissionDevice.schema'
import { CommissionDeviceDto } from './dto/commission-device.dto'
import { AuthenticateAccountSchema } from '../identity/schema/authenticateAccountSchema'
import { AuthenticateAccountDto } from '../identity/dto/authenticate-account.dto'
import { TokenResponse } from '../identity/types/auth'

@Controller('devices')
export class DeviceController {
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

  @Post('commission')
  @UsePipes(new ZodValidationPipe(CommissionDeviceSchema))
  commissionDevice(@Body() commissionDeviceDto: CommissionDeviceDto): Promise<Device> {
    return this.devicesService.commission(commissionDeviceDto)
  }

  @Post('authenticate')
  @UsePipes(new ZodValidationPipe(AuthenticateAccountSchema))
  authenticateDevice(@Body() authenticateAccountDto: AuthenticateAccountDto): Promise<TokenResponse> {
    return this.devicesService.authenticate(authenticateAccountDto)
  }

  @Get('mine')
  getDeviceDetails(): Promise<DeviceResponseForMachine> {
    return this.devicesService.getDeviceDetails()
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
