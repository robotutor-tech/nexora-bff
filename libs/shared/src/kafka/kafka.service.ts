import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { CacheService } from '@shared/cache/cache.service'
import { randomUUID } from 'node:crypto'
import { CacheData } from '@shared/cache/cache'

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(this.constructor.name)
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly cacheService: CacheService
  ) {}

  async publish<T>(topicName: string, clientId: string, message: T): Promise<void> {
    const cacheData = await this.cacheService.get<CacheData>(clientId)
    if (!cacheData) {
      throw new Error('Cache data not found')
    }
    this.kafkaClient.emit(topicName, {
      value: JSON.stringify(message),
      headers: {
        actorData: JSON.stringify(cacheData.actorData),
        'x-trace-id': `${process.env.APPLICATION_NAME}:${clientId}::${randomUUID()}`
      }
    })
    this.logger.log(`Successfully published kafka topic ${topicName}`)
  }
}
