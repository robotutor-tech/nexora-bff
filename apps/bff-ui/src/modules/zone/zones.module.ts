import { Module } from '@nestjs/common'
import { ZonesService } from './zones.service'
import { ZonesController } from './zones.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [ZonesController],
  providers: [ZonesService]
})
export class ZonesModule {}
