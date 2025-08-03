import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common'
import { ZonesService } from './zones.service'
import { CreateZoneDto } from './dto/create-zone.dto'
import { Zone } from './types/zone'
import { CreateZoneSchema } from './schema/createZone.schema'
import { ZodValidationPipe } from '@shared'

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateZoneSchema))
  createZone(@Body() createZoneDto: CreateZoneDto): Promise<Zone> {
    return this.zonesService.create(createZoneDto)
  }

  @Get()
  getAllZones(): Promise<Zone[]> {
    return this.zonesService.getAllZones()
  }
}
