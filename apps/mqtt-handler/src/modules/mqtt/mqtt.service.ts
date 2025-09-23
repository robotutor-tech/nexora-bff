import { Injectable } from '@nestjs/common'
import { AuthenticationResponse, AuthorizationResponse } from './types/mqtt'
import { AuthenticationRequest } from './dto/authenticationDto'
import { AclRequest } from './dto/acl.dto'
import { ChainFactory } from './chain/chain.factory'
import { StatusRequest } from './dto/status.dto'

@Injectable()
export class MqttService {
  constructor(private readonly chainFactory: ChainFactory) {}

  async validateAuthToken(authenticationRequest: AuthenticationRequest): Promise<AuthenticationResponse> {
    const chain = this.chainFactory.authenticationChain()
    return chain.handle(authenticationRequest)
  }

  async validateAcl(aclRequest: AclRequest): Promise<AuthorizationResponse> {
    const chain = this.chainFactory.authorizationChain()
    return chain.handle(aclRequest)
  }

  updateStatus(statusRequest: StatusRequest): void {
    console.log(statusRequest, '------status-----')
    // const chain = this.chainFactory.accessValidationChain()
    // return chain.handle(statusRequest)
  }
}
