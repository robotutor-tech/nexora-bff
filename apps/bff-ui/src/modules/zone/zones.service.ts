import { Injectable } from '@nestjs/common'
import { CreateZoneRequest } from './dto/create-zone.dto'
import { Zone } from './types/zone'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class ZonesService {
  private readonly zoneConfig = apiConfig.zone

  constructor(private readonly webclient: Webclient) {}

  create(zoneRequest: CreateZoneRequest): Promise<Zone> {
    return this.webclient.post<Zone>({ baseUrl: this.zoneConfig.baseUrl, path: '', body: zoneRequest })
  }

  getAllZones(): Promise<Zone[]> {
    return this.webclient.get<Zone[]>({ baseUrl: this.zoneConfig.baseUrl, path: '' })
  }
}
