import { Module } from '@nestjs/common'
import { FeedsService } from './feeds.service'
import { FeedsController } from './feeds.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [FeedsController],
  providers: [FeedsService]
})
export class FeedsModule {}
