import { Module } from '@nestjs/common'
import { KafkaModule } from '@shared/kafka/kafka.module'
import { DownlinkBridge } from './downlink.bridge'
import { MqttModule } from '@shared/mqtt/mqtt.module'

@Module({
  controllers: [DownlinkBridge],
  imports: [KafkaModule, MqttModule]
})
export class BridgeModule {}
