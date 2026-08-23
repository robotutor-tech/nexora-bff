import { Module } from '@nestjs/common'
import { ProxyService } from './proxy.service'
import { ProxyController } from './proxy.controller'
import { WebclientModule } from '@shared'

@Module({
  imports: [WebclientModule],
  controllers: [ProxyController],
  providers: [ProxyService]
})
export class ProxyModule {}
