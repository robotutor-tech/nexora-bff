import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common'
import { DevicesService } from './devices.service'
import { Device, DeviceInvitation } from './types/device'
import { CreateDeviceInvitationDto } from './dto/create-device-invitation.dto'
import { CreateDeviceInvitationSchema } from './schema/createDeviceInvitation.schema'
import { ZodValidationPipe } from '@shared'

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('invitations')
  @UsePipes(new ZodValidationPipe(CreateDeviceInvitationSchema))
  createDeviceInvitation(@Body() createDeviceInvitationDto: CreateDeviceInvitationDto): Promise<DeviceInvitation> {
    return this.devicesService.createDeviceInvitation(createDeviceInvitationDto)
  }

  @Get()
  getAllDevices(): Promise<Device[]> {
    return this.devicesService.getAllDevices()
  }

  @Get('invitations')
  getAllDevicesInvitations(): Promise<DeviceInvitation[]> {
    return this.devicesService.getAllDevicesInvitations()
  }
}
