import { Injectable } from '@nestjs/common'
import { Premises, PremisesWithActors } from './types/premises'
import { CreatePremisesRequest } from './dto/create-premises.dto'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class PremisesService {
  private readonly orchestrationConfig = apiConfig.orchestration
  private readonly premisesConfig = apiConfig.premises

  constructor(private readonly webclient: Webclient) {}

  createPremises(createRequest: CreatePremisesRequest): Promise<PremisesWithActors> {
    return this.webclient.post<PremisesWithActors>({
      baseUrl: this.orchestrationConfig.baseUrl,
      path: this.orchestrationConfig.registerPremises,
      body: createRequest
    })
  }

  getAllPremises(): Promise<PremisesWithActors[]> {
    return this.webclient.get<PremisesWithActors[]>({
      baseUrl: this.orchestrationConfig.baseUrl,
      path: this.orchestrationConfig.getPremises
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
