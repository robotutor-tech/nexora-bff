import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  update<T = unknown>(keyName: string, value: T, ttlSeconds: number): Promise<T> {
    return this.cacheManager.set(keyName, value, ttlSeconds * 1000)
  }

  get<T>(keyName: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(keyName)
  }
}
