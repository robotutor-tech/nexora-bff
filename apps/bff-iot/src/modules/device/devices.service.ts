import { Injectable } from '@nestjs/common'
import { DeviceInvitation } from './types/device'
import { RegisterDeviceRequest } from './dto/register-device.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class DevicesService {
  private readonly orchestrationConfig = apiConfig.orchestration

  constructor(private readonly webclient: Webclient) {}

  registerDevice(request: RegisterDeviceRequest): Promise<DeviceInvitation> {
    return this.webclient.post<DeviceInvitation>({
      baseUrl: this.orchestrationConfig.baseUrl,
      path: this.orchestrationConfig.registerDevice,
      body: request
    })
  }
}
