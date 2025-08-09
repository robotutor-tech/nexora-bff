import type { IClientOptions } from 'mqtt/lib/client'
import * as process from 'node:process'

export const MqttConfig: IClientOptions = {
  protocol: 'mqtt',
  host: process.env.MQTT_HOST ?? 'localhost',
  port: Number(process.env.MQTT_PORT) || 1883,
  protocolVersion: 5,
  username: process.env.APPLICATION_NAME ?? 'application',
  password: process.env.MQTT_PASSWORD ?? 'password',
  clientId: process.env.APPLICATION_NAME ?? 'application'
}
