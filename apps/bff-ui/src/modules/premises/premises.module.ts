import { Module } from '@nestjs/common'
import { PremisesService } from './premises.service'
import { PremisesController } from './premises.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [PremisesController],
  providers: [PremisesService]
})
export class PremisesModule {}
