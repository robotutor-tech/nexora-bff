import { Injectable } from '@nestjs/common'
import { DeviceInvitation } from './types/device'
import { RegisterDeviceRequest } from './dto/register-device.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class DevicesService {
  private readonly deviceConfig = apiConfig.device

  constructor(private readonly webclient: Webclient) {}

  registerDevice(request: RegisterDeviceRequest): Promise<DeviceInvitation> {
    return this.webclient.post<DeviceInvitation>({
      baseUrl: this.deviceConfig.baseUrl,
      path: '',
      body: request
    })
  }
}
