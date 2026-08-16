import { Injectable } from '@nestjs/common'
import { Premises } from './types/premises'
import { CreatePremisesRequest } from './dto/create-premises.dto'
import { apiConfig, Webclient } from '@shared'
import { Actor } from '@shared/cache/cache'

@Injectable()
export class PremisesService {
  private readonly premisesConfig = apiConfig.premises
  private readonly identityConfig = apiConfig.identity

  constructor(private readonly webclient: Webclient) {}

  async registerPremises(createRequest: CreatePremisesRequest): Promise<Premises> {
    return this.webclient.post<Premises>({
      baseUrl: this.premisesConfig.baseUrl,
      path: this.premisesConfig.premises,
      body: createRequest
    })
  }

  async getAllPremises(): Promise<Premises[]> {
    const actors = await this.webclient.get<Actor[]>({
      baseUrl: this.identityConfig.baseUrl,
      path: this.identityConfig.actors
    })
    if (actors.length === 0) {
      return []
    }

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
