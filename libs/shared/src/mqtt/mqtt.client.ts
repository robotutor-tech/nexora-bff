import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { connect, MqttClient as MqttClientClient } from 'mqtt'
import { MqttConfig } from '@shared/mqtt/mqtt.config'
import { MqttCallback } from '@shared/mqtt/mqtt'

@Injectable()
export class MqttClient implements OnModuleInit, OnModuleDestroy {
  private client: MqttClientClient
  private callbacks: Record<string, MqttCallback[]> = {}

  onModuleInit(): void {
    this.client = connect('mqtt://127.0.0.1:1883', MqttConfig)
    this.client.on('connect', () => {
      const topics = Object.keys(this.callbacks).map(topic => `$share/${process.env.APPLICATION_NAME!}/${topic}`)
      this.client.subscribe(topics)
    })

    this.client.on('message', (topic: string, payload: Buffer) => {
      this.findCallbacksForTopic(topic).forEach(callback => {
        callback({ topic, payload: JSON.parse(payload.toString()) as Record<string, unknown> })
      })
    })
  }

  onModuleDestroy(): void {
    this.client.end()
  }

  publish<T = any>(topic: string, message: T): void {
    this.client.publish(topic, JSON.stringify(message), { qos: 1, retain: true })
  }

  subscribe(topic: string, callback: MqttCallback): void {
    const topicName = `$share/${process.env.APPLICATION_NAME!}/${topic}`
    this.client.subscribe(topicName)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.callbacks[topic]) {
      this.callbacks[topic] = []
    }
    this.callbacks[topic].push(callback)
  }

  private matchTopic(pattern: string, topic: string): boolean {
    const regex = new RegExp(`^${pattern.replace('+', '[^/]+').replace('#', '.+')}$`)
    return regex.test(topic)
  }

  private findCallbacksForTopic(topic: string): MqttCallback[] {
    const matchedTopic = Object.keys(this.callbacks).find(topicName => this.matchTopic(topicName, topic))
    if (!matchedTopic) {
      return []
    }
    return this.callbacks[matchedTopic]
  }
}
