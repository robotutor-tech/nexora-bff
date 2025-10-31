import { Injectable } from '@nestjs/common'
import { BaseHandler } from './base.handler'
import { AuthorizationResponse } from '../types/mqtt'
import { AclRequest } from '../dto/acl.dto'

@Injectable()
export class BFFAuthorizationHandler extends BaseHandler<AclRequest, AuthorizationResponse> {
  constructor() {
    super()
  }

  async handle(aclRequest: AclRequest): Promise<AuthorizationResponse> {
    if (aclRequest.clientId === 'NEXORA-BFF') {
      return { result: 'allow' }
    }
    return super.next(aclRequest)
  }
}
