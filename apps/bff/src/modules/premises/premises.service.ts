import { Injectable } from '@nestjs/common'
import { Premises } from './types/premises'
import { CreatePremisesRequest } from './dto/create-premises.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class PremisesService {
  private readonly premisesConfig = apiConfig.premises
  private readonly orchestrationConfig = apiConfig.orchestration

  constructor(private readonly webclient: Webclient) {}

  createPremises(createRequest: CreatePremisesRequest): Promise<Premises> {
    return this.webclient.post<Premises>({
      baseUrl: this.premisesConfig.baseUrl,
      path: this.premisesConfig.premises,
      body: createRequest
    })
  }

  getAllPremises(): Promise<Premises[]> {
    return this.webclient.get<Premises[]>({
      baseUrl: this.orchestrationConfig.baseUrl,
      path: this.orchestrationConfig.premises
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
