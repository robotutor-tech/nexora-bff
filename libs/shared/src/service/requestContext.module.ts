import { Module, Scope } from '@nestjs/common'
import { RequestContextService } from './requestContext.service'
import { CacheModule } from '@shared/cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [
    {
      provide: RequestContextService,
      useClass: RequestContextService,
      scope: Scope.REQUEST
    }
  ],
  exports: [RequestContextService]
})
export class RequestContextModule {}
