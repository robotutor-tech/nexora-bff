import type { KafkaOptions } from '@nestjs/microservices'
import { Transport } from '@nestjs/microservices'

export const KafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: process.env.APPLICATION_NAME!,
      brokers: [process.env.KAFKA_URL ?? '127.0.0.1:9092']
    },
    consumer: {
      groupId: process.env.APPLICATION_NAME!
    }
  }
}
