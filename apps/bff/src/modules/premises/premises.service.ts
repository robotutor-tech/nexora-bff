import { Injectable } from '@nestjs/common'
import { Premises, PremisesWithActors } from './types/premises'
import { CreatePremisesRequest } from './dto/create-premises.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class PremisesService {
  private readonly premisesConfig = apiConfig.premises

  constructor(private readonly webclient: Webclient) {}

  createPremises(createRequest: CreatePremisesRequest): Promise<PremisesWithActors> {
    return this.webclient.post<PremisesWithActors>({
      baseUrl: this.premisesConfig.baseUrl,
      path: this.premisesConfig.premises,
      body: createRequest
    })
  }

  getAllPremises(): Promise<PremisesWithActors[]> {
    return this.webclient.get<PremisesWithActors[]>({
      baseUrl: this.premisesConfig.baseUrl,
      path: this.premisesConfig.premises,
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
