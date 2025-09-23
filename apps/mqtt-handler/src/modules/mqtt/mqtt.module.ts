import { Module } from '@nestjs/common'
import { MqttService } from './mqtt.service'
import { MqttController } from './mqtt.controller'
import { WebclientModule } from '@shared'
import { CacheModule } from '@shared/cache/cache.module'
import { ActorDataRetriever } from './handlers/dataRetriever/actorData.retriever'
import { HandlersModule } from './handlers/handlers.module'
import { ChainModule } from './chain/chain.module'

@Module({
  imports: [WebclientModule, CacheModule, HandlersModule, ChainModule],
  controllers: [MqttController],
  providers: [MqttService, ActorDataRetriever]
})
export class MqttModule {}
