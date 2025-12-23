import { Injectable } from '@nestjs/common'
import { Premises } from './types/premises'
import { CreatePremisesRequest } from './dto/create-premises.dto'
import { apiConfig, Webclient } from '@shared'
import { Actor } from '@shared/cache/cache'

@Injectable()
export class PremisesService {
  private readonly premisesConfig = apiConfig.premises
  private readonly iamConfig = apiConfig.iam

  constructor(private readonly webclient: Webclient) {}

  async registerPremises(createRequest: CreatePremisesRequest): Promise<Premises> {
    const premises = await this.webclient.post<Premises>({
      baseUrl: this.premisesConfig.baseUrl,
      path: this.premisesConfig.premises,
      body: createRequest
    })
    await this.webclient.post<unknown>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.premisesOwnerRegister,
      body: { premisesId: premises.premisesId }
    })
    return premises
  }

  async getAllPremises(): Promise<Premises[]> {
    const actors = await this.webclient.get<Actor[]>({
      baseUrl: this.iamConfig.baseUrl,
      path: this.iamConfig.actors
    })
    const queryParams = new URLSearchParams()
    actors.forEach(actor => {
      queryParams.append('premisesIds', actor.premisesId)
    })
    return this.webclient.get<Premises[]>({
      baseUrl: this.premisesConfig.baseUrl,
      path: this.premisesConfig.premises,
      queryParams
    })
  }

  getPremises(premisesId: string): Promise<Premises> {
    return this.webclient.get<Premises>({
      baseUrl: this.premisesConfig.baseUrl,
      path: this.premisesConfig.premisesDetails,
      uriVariables: { premisesId }
    })
  }
}
