import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { Document } from '../types/types'

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getForwardHeaders(): Document<string> {
    const { headers } = this.request
    return {
      authorization: headers['authorization'] ?? '',
      'x-trace-id': (headers['x-trace-id'] ?? '') as string
    }
  }
}
