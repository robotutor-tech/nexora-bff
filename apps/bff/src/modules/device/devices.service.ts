import { Injectable } from '@nestjs/common'
import { Device, DeviceFirmwareResponse, RegisterDeviceResponse } from './types/device'
import { RegisterDeviceRequest } from './dto/register-device.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class DevicesService {
  private readonly deviceConfig = apiConfig.device
  private readonly orchestrationConfig = apiConfig.orchestration

  constructor(private readonly webclient: Webclient) {}

  registerDevice(registerDeviceRequest: RegisterDeviceRequest): Promise<RegisterDeviceResponse> {
    return this.webclient.post<RegisterDeviceResponse>({
      baseUrl: this.orchestrationConfig.baseUrl,
      path: this.orchestrationConfig.devices,
      body: registerDeviceRequest
    })
  }

  getAllDevices(): Promise<Device[]> {
    return this.webclient.get<Device[]>({ baseUrl: this.deviceConfig.baseUrl, path: this.deviceConfig.devices })
  }

  // getAllDevicesInvitations(): Promise<RegisterDeviceResponse[]> {
  //   return this.webclient.get<RegisterDeviceResponse[]>({
  //     baseUrl: this.orchestrationConfig.baseUrl,
  //     path: this.orchestrationConfig.deviceInvitation
  //   })
  // }

  // registerDevice(request: RegisterDeviceRequest): Promise<RegisterDeviceResponse> {
  //   return this.webclient.post<RegisterDeviceResponse>({
  //     baseUrl: this.deviceConfig.baseUrl,
  //     path: this.deviceConfig.devices,
  //     body: request
  //   })
  // }

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
