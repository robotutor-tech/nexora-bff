import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { Document } from '../types/types'
import { randomUUID } from 'node:crypto'

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getForwardHeaders(): Document<string> {
    const { headers } = this.request
    return {
      authorization: headers['authorization'] ?? '',
      'correlation-id': (this.request.headers['correlation-id'] ?? randomUUID().toString()) as string
    }
  }

  updateAuthorization(authorization: string): void {
    this.request.headers.authorization = authorization
  }
}
