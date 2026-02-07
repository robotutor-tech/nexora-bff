import { Injectable } from '@nestjs/common'
import { Device, DeviceFirmwareResponse, DeviceResponse } from './types/device'
import { RegisterDeviceRequest } from './dto/register-device.dto'
import { apiConfig, Webclient } from '@shared'
import { randomUUID } from 'node:crypto'
import { Account } from '../iam/types/account'
import { CommissionDeviceRequest } from './dto/commission-device.dto'
import { AccountService } from '../iam/account.service'
import { ActorService } from '../iam/actor.service'
import { RequestContextService } from '@shared/service/requestContext.service'

@Injectable()
export class DeviceService {
  private readonly deviceConfig = apiConfig.device
  private readonly iamConfig = apiConfig.iam

  constructor(
    private readonly webclient: Webclient,
    private readonly accountService: AccountService,
    private readonly actorService: ActorService,
    private readonly requestContextService: RequestContextService
  ) {}

  async registerDevice(registerDeviceRequest: RegisterDeviceRequest): Promise<DeviceResponse> {
    const device = await this.webclient.post<Device>({
      baseUrl: this.deviceConfig.baseUrl,
      path: this.deviceConfig.devices,
      body: registerDeviceRequest
    })
    const payload = {
      credentialId: randomUUID(),
      secret: (randomUUID() + randomUUID()).replaceAll('-', ''),
      kind: 'API_SECRET',
      type: 'MACHINE',
      principalId: device.deviceId
    }
    await this.webclient.post<Account>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.machineAccountRegister,
      body: payload
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

  async commission(request: CommissionDeviceRequest): Promise<Device> {
    const accountToken = await this.accountService.authenticate({
      credentialId: request.credentialId,
      secret: request.secret
    })
    this.requestContextService.updateAuthorization(accountToken.token)
    const currentDevice = await this.getCurrentDevice()
    const { premisesId } = await this.actorService
      .registerDeviceActor(currentDevice.deviceId, currentDevice.premisesId)
      .catch(() => currentDevice)
    const actorToken = await this.actorService.authenticate({ premisesId: premisesId })
    this.requestContextService.updateAuthorization(actorToken.token)
    return this.webclient.post<Device>({
      baseUrl: this.deviceConfig.baseUrl,
      path: this.deviceConfig.commission,
      body: {
        serialNo: request.serialNo,
        modelNo: request.modelNo,
        osName: request.osName,
        osVersion: request.osVersion
      }
    })
  }
}
