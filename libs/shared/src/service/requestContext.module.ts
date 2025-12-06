import { Module } from '@nestjs/common'
import { RequestContextService } from './requestContext.service'
import { CacheModule } from '@shared/cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [RequestContextService],
  exports: [RequestContextService]
})
export class RequestContextModule {}
