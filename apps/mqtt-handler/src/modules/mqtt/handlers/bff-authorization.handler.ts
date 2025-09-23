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
    if (aclRequest.internalId === 'BFF-IOT' && aclRequest.clientId === 'BFF-IOT') {
      return { result: 'allow' }
    }
    if (aclRequest.internalId === 'BFF-UI' && aclRequest.clientId === 'BFF-UI') {
      return { result: 'allow' }
    }
    return super.next(aclRequest)
  }
}
