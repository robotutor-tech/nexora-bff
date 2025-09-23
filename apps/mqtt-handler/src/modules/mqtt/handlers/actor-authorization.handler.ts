import { Injectable } from '@nestjs/common'
import { BaseHandler } from './base.handler'
import { AuthorizationResponse } from '../types/mqtt'
import { AclRequest } from '../dto/acl.dto'
import { apiConfig, Webclient } from '@shared'
import { CacheService } from '@shared/cache/cache.service'
import { CacheData } from '@shared/cache/cache'

@Injectable()
export class ActorAuthorizationHandler extends BaseHandler<AclRequest, AuthorizationResponse> {
  private readonly entitlementConfig = apiConfig.entitlement
  constructor(
    private readonly webclient: Webclient,
    private readonly cacheService: CacheService
  ) {
    super()
  }

  async handle(aclRequest: AclRequest): Promise<AuthorizationResponse> {
    const { resourceId, resourceType } = this.getResource(aclRequest.topic)
    const action = this.getAction(aclRequest, resourceType)
    const cacheData = await this.cacheService.get<CacheData>(aclRequest.clientId)
    if (!cacheData) {
      return { result: 'deny' }
    }
    return this.webclient
      .post<boolean>({
        baseUrl: this.entitlementConfig.baseUrl,
        path: this.entitlementConfig.authorize,
        body: { resourceType, action, resourceId },
        headers: { Authorization: cacheData.authorization }
      })
      .then(result => ({ result: result ? 'allow' : 'deny' }) as AuthorizationResponse)
      .catch(() => ({ result: 'deny' }))
  }

  private getAction(aclRequest: AclRequest, resourceType: string) {
    if (aclRequest.action === 'subscribe') {
      return 'READ'
    }
    if (aclRequest.action === 'publish' && aclRequest.topic.endsWith('/value') && resourceType === 'FEED') {
      return 'CONTROL'
    }
    return 'UPDATE'
  }

  private getResource(topic: string): { resourceId: string; resourceType: string } {
    const parts = topic.split('/')
    return { resourceId: parts[2], resourceType: parts[1].toLocaleUpperCase() }
  }
}
