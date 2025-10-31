import { Injectable } from '@nestjs/common'
import { StatusRequest } from './dto/status.dto'
import { apiConfig, Webclient } from '@shared'
import { CacheService } from '@shared/cache/cache.service'
import { CacheData } from '@shared/cache/cache'

@Injectable()
export class UpdateDeviceStatus {
  private readonly deviceConfig = apiConfig.device

  constructor(
    private readonly webclient: Webclient,
    private readonly cacheService: CacheService
  ) {}

  async update(statusRequest: StatusRequest): Promise<void> {
    if (!statusRequest.clientid.startsWith('nexora-')) {
      return
    }

    const cacheData = await this.cacheService.get<CacheData>(statusRequest.clientid)
    if (!cacheData) {
      return
    }

    return this.webclient.patch({
      baseUrl: this.deviceConfig.baseUrl,
      path: this.deviceConfig.health,
      body: { health: statusRequest.event.split('.')[1].toUpperCase() },
      headers: { Authorization: cacheData.authorization }
    })
  }
}
