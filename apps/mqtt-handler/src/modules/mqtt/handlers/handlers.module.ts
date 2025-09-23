import { Module } from '@nestjs/common'
import { BFFAuthorizationHandler } from './bff-authorization.handler'
import { BFFAuthenticationHandler } from './bff-authentication.handler'
import { ActorDataRetriever } from './dataRetriever/actorData.retriever'
import { CacheModule } from '@shared/cache/cache.module'
import { WebclientModule } from '@shared'
import { ActorAuthorizationHandler } from './actor-authorization.handler'
import { ActorAuthenticationHandler } from './actor-authentication.handler'
import { UpdateCacheHandler } from './updateCache.handler'

@Module({
  imports: [CacheModule, WebclientModule],
  providers: [
    BFFAuthenticationHandler,
    BFFAuthorizationHandler,
    ActorDataRetriever,
    ActorAuthorizationHandler,
    ActorAuthenticationHandler,
    UpdateCacheHandler
  ],
  exports: [
    BFFAuthenticationHandler,
    BFFAuthorizationHandler,
    ActorDataRetriever,
    ActorAuthorizationHandler,
    ActorAuthenticationHandler,
    UpdateCacheHandler
  ]
})
export class HandlersModule {}
