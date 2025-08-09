import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class KafkaService {
  constructor(@Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientProxy) {}

  publish<T = any>(topicName: string, message: T): void {
    this.kafkaClient.emit(topicName, message)
  }
}
