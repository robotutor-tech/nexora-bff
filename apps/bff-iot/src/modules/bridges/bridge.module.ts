import { Module } from '@nestjs/common'
import { KafkaModule } from '@shared/kafka/kafka.module'
import { DownlinkBridge } from './downlink.bridge'
import { UplinkBridge } from './uplink.bridge'
import { MqttModule } from '@shared/mqtt/mqtt.module'

@Module({
  controllers: [DownlinkBridge, UplinkBridge],
  imports: [KafkaModule, MqttModule]
})
export class BridgeModule {}
