import { Injectable } from '@nestjs/common'
import { BaseHandler } from './base.handler'
import { AuthenticationRequest } from '../dto/authenticationDto'
import { CacheService } from '@shared/cache/cache.service'
import { ActorDataRetriever } from './dataRetriever/actorData.retriever'
import { CacheData, ValidatedResponse } from '@shared/cache/cache'

export type UpdateCacheRequest = { authRequest: AuthenticationRequest; response: ValidatedResponse }

@Injectable()
export class UpdateCacheHandler extends BaseHandler<UpdateCacheRequest, CacheData> {
  constructor(
    private readonly cacheService: CacheService,
    private readonly actorDataRetriever: ActorDataRetriever
  ) {
    super()
  }

  async handle({ authRequest, response }: UpdateCacheRequest): Promise<CacheData> {
    const ttl = new Date(response.expiresAt).getTime() - new Date().getTime()
    const actorData = await this.actorDataRetriever.retrieve(authRequest)
    return this.cacheService.update(
      authRequest.clientId,
      { validatedResponse: response, actorData, authorization: authRequest.password },
      ttl
    )
  }
}
