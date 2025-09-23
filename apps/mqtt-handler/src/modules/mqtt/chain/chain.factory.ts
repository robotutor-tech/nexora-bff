import { Injectable } from '@nestjs/common'
import { ChainBuilder } from './chain.builder'
import { BaseHandler } from '../handlers/base.handler'
import { BFFAuthenticationHandler } from '../handlers/bff-authentication.handler'
import { AuthenticationRequest } from '../dto/authenticationDto'
import { AuthenticationResponse, AuthorizationResponse } from '../types/mqtt'
import { AclRequest } from '../dto/acl.dto'
import { BFFAuthorizationHandler } from '../handlers/bff-authorization.handler'
import { StatusRequest } from '../dto/status.dto'
import { ActorAuthorizationHandler } from '../handlers/actor-authorization.handler'
import { ActorAuthenticationHandler } from '../handlers/actor-authentication.handler'
import { UpdateCacheHandler } from '../handlers/updateCache.handler'

@Injectable()
export class ChainFactory {
  // eslint-disable-next-line max-params
  constructor(
    private readonly chainBuilder: ChainBuilder,
    private readonly bffAuthenticationHandler: BFFAuthenticationHandler,
    private readonly actorAuthenticationHandler: ActorAuthenticationHandler,
    private readonly updateCacheHandler: UpdateCacheHandler,
    private readonly bffAuthorizationHandler: BFFAuthorizationHandler,
    private readonly actorAuthorizationHandler: ActorAuthorizationHandler
  ) {}

  authenticationChain(): BaseHandler<AuthenticationRequest, AuthenticationResponse> {
    return this.chainBuilder
      .add(this.bffAuthenticationHandler)
      .add(this.actorAuthenticationHandler)
      .add(this.updateCacheHandler)
      .build<AuthenticationRequest, AuthenticationResponse>()
  }

  authorizationChain(): BaseHandler<AclRequest, AuthorizationResponse> {
    return this.chainBuilder
      .add(this.bffAuthorizationHandler)
      .add(this.actorAuthorizationHandler)
      .build<AclRequest, AuthorizationResponse>()
  }

  accessValidationChain(): BaseHandler<StatusRequest, AuthorizationResponse> {
    return this.chainBuilder.build<StatusRequest, AuthorizationResponse>()
  }
}
