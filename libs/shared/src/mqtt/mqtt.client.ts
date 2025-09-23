import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { connect, MqttClient as MqttClientClient } from 'mqtt'
import { MqttConfig } from '@shared/mqtt/mqtt.config'
import { MqttCallback } from '@shared/mqtt/mqtt'

@Injectable()
export class MqttClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(this.constructor.name)
  private client: MqttClientClient
  private callbacks: Record<string, MqttCallback[]> = {}

  onModuleInit(): void {
    this.client = connect('mqtt://127.0.0.1:1883', MqttConfig)
    this.client.on('connect', () => {
      const topics = Object.keys(this.callbacks).map(
        topic => `$share/${process.env.APPLICATION_NAME}/enriched/${topic}`
      )
      this.client.subscribe(topics)
    })

    this.client.on('message', (_topicName: string, buffer: Buffer) => {
      const { topic, clientId, payload } = JSON.parse(buffer.toString()) as {
        topic: string
        clientId: string
        payload: Record<string, unknown>
      }
      this.logger.log(`Received mqtt topic ${topic}`, { clientId, payload })
      this.findCallbacksForTopic(topic).forEach(callback => {
        callback({ topic, payload, clientId })
      })
    })
  }

  onModuleDestroy(): void {
    this.client.end()
  }

  publish<T>(topic: string, message: T): void {
    this.client.publish(topic, JSON.stringify(message), { qos: 1, retain: true })
    this.logger.log(`Successfully published mqtt topic ${topic}`)
  }

  subscribe(topic: string, callback: MqttCallback): void {
    const topicName = `$share/${process.env.APPLICATION_NAME}/enriched/${topic}`
    this.client.subscribe(topicName)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.callbacks[topic]) {
      this.callbacks[topic] = []
    }
    this.callbacks[topic].push(callback)
    this.logger.log(`Successfully subscribed mqtt topic ${topic}`)
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
