import { Injectable } from '@nestjs/common'
import { Webclient } from '@shared'
import type { Request } from 'express'
import type { WebClientRequest } from '@shared/webclient/webclient'
import { Document } from '@shared/types/types'

@Injectable()
export class ProxyService {
  constructor(private readonly webClient: Webclient) {}

  forward(request: Request): Promise<Document> {
    return this.webClient.request<Document>({
      method: request.method as WebClientRequest['method'],
      body: request.body as Document,
      path: request.originalUrl
    })
  }
}
