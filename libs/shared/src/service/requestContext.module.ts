import { Module, Scope } from '@nestjs/common'
import { RequestContextService } from './requestContext.service'

@Module({
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
