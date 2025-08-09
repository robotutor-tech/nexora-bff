import { Module } from '@nestjs/common'
import { MqttClient } from '@shared/mqtt/mqtt.client'
import { MqttSubscriberExplorer } from '@shared/mqtt/mqtt.service'
import { DiscoveryService, MetadataScanner } from '@nestjs/core'

@Module({
  imports: [],
  providers: [MqttClient, MqttSubscriberExplorer, DiscoveryService, MetadataScanner],
  exports: [MqttClient]
})
export class MqttModule {}
