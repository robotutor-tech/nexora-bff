import { Injectable } from '@nestjs/common'
import { Device, DeviceFirmwareResponse, DeviceResponse } from './types/device'
import { RegisterDeviceRequest } from './dto/register-device.dto'
import { apiConfig, Webclient } from '@shared'
import { randomUUID } from 'node:crypto'
import { Account } from '../iam/types/account'
import { CommissionDeviceRequest } from './dto/commission-device.dto'

@Injectable()
export class DeviceService {
  private readonly deviceConfig = apiConfig.device
  private readonly iamConfig = apiConfig.iam

  constructor(private readonly webclient: Webclient) {}

  async registerDevice(registerDeviceRequest: RegisterDeviceRequest): Promise<DeviceResponse> {
    const payload = {
      credentialId: randomUUID(),
      secret: (randomUUID() + randomUUID()).replaceAll('-', ''),
      kind: 'API_SECRET',
      type: 'MACHINE'
    }
    const account = await this.webclient.post<Account>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.machineAccountRegister,
      body: payload
    })
    const device = await this.webclient.post<Device>({
      baseUrl: this.deviceConfig.baseUrl,
      path: this.deviceConfig.devices,
      body: { ...registerDeviceRequest, accountId: account.accountId }
    })
    return { ...device, credentialId: payload.credentialId, secret: payload.secret }
  }

  getAllDevices(): Promise<Device[]> {
    return this.webclient.get<Device[]>({ baseUrl: this.deviceConfig.baseUrl, path: this.deviceConfig.devices })
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

  commission(request: CommissionDeviceRequest): Promise<Device> {
    return this.webclient.post<Device>({
      baseUrl: this.deviceConfig.baseUrl,
      path: this.deviceConfig.commission,
      body: request
    })
  }
}
