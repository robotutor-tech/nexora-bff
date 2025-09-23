import { Module } from '@nestjs/common'
import { CacheService } from './cache.service'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import KeyvRedis from '@keyv/redis'

@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory() {
        return {
          stores: [new KeyvRedis(process.env.REDIS_URL ?? 'redis://localhost:6379')]
        }
      }
    })
  ],
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheModule {}
