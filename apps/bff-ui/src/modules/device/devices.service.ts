import { Injectable } from '@nestjs/common'
import { Device, DeviceInvitation } from './types/device'
import { CreateDeviceInvitationRequest } from './dto/create-device-invitation.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class DevicesService {
  private readonly deviceConfig = apiConfig.device
  private readonly authConfig = apiConfig.auth

  constructor(private readonly webclient: Webclient) {}

  createDeviceInvitation(deviceInvitationRequest: CreateDeviceInvitationRequest): Promise<DeviceInvitation> {
    return this.webclient.post<DeviceInvitation>({
      baseUrl: this.authConfig.baseUrl,
      path: this.authConfig.deviceInvitation,
      body: deviceInvitationRequest
    })
  }

  getAllDevices(): Promise<Device[]> {
    return this.webclient.get<Device[]>({ baseUrl: this.deviceConfig.baseUrl, path: '' })
  }

  getAllDevicesInvitations(): Promise<DeviceInvitation[]> {
    return this.webclient.get<DeviceInvitation[]>({
      baseUrl: this.authConfig.baseUrl,
      path: this.authConfig.deviceInvitation
    })
  }
}
