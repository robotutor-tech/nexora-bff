import type { KafkaOptions } from '@nestjs/microservices'
import { Transport } from '@nestjs/microservices'

export const CacheConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'my-app',
      // eslint-disable-next-line no-process-env
      brokers: [process.env.KAFKA_URL ?? '127.0.0.1:9092']
    },
    consumer: {
      groupId: 'bff-iot',
    }
  }
}
