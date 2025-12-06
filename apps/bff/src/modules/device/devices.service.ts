import { Injectable } from '@nestjs/common'
import { Device, DeviceFirmwareResponse, DeviceInvitation, RegisterDeviceResponse } from './types/device'
import { CreateDeviceInvitationRequest } from './dto/create-device-invitation.dto'
import { apiConfig, Webclient } from '@shared'
import { RegisterDeviceRequest } from './dto/register-device.dto'

@Injectable()
export class DevicesService {
  private readonly deviceConfig = apiConfig.device
  private readonly authConfig = apiConfig.iam

  constructor(private readonly webclient: Webclient) {}

  createDeviceInvitation(deviceInvitationRequest: CreateDeviceInvitationRequest): Promise<DeviceInvitation> {
    return this.webclient.post<DeviceInvitation>({
      baseUrl: this.authConfig.baseUrl,
      path: this.authConfig.deviceInvitation,
      body: deviceInvitationRequest
    })
  }

  getAllDevices(): Promise<Device[]> {
    return this.webclient.get<Device[]>({ baseUrl: this.deviceConfig.baseUrl, path: this.deviceConfig.devices })
  }

  getAllDevicesInvitations(): Promise<DeviceInvitation[]> {
    return this.webclient.get<DeviceInvitation[]>({
      baseUrl: this.authConfig.baseUrl,
      path: this.authConfig.deviceInvitation
    })
  }

  registerDevice(request: RegisterDeviceRequest): Promise<RegisterDeviceResponse> {
    return this.webclient.post<RegisterDeviceResponse>({
      baseUrl: this.deviceConfig.baseUrl,
      path: this.deviceConfig.devices,
      body: request
    })
  }

  getCurrentDevice(): Promise<Device> {
    return this.webclient.get<Device>({
      baseUrl: this.deviceConfig.baseUrl,
      path: this.deviceConfig.me
    })
  }

  getDeviceFirmware(): Promise<DeviceFirmwareResponse> {
    return this.webclient.get<DeviceFirmwareResponse>({
      baseUrl: this.deviceConfig.baseUrl,
      path: this.deviceConfig.deviceFirmware
    })
  }
}
