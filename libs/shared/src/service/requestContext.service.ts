import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { Document } from '../types/types'
import { randomUUID } from 'node:crypto'
import { CORRELATION_ID } from '@shared/middleware/attach-correlation-id/attach-trace-id.middleware'

const AUTHORIZATION_PREFIX = 'Bearer '
const EMPTY_VALUE = ''
const FIRST_ITEM_INDEX = 0
export const AUTHORIZATION_HEADER = 'Authorization'

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getForwardHeaders(): Document<string> {
    const { headers } = this.request
    const accessToken = (this.request.cookies.access_token ?? '') as string
    const forwardHeaders = this.getTraceHeaders(headers)
    forwardHeaders[AUTHORIZATION_HEADER] = this.normalizeAuthorization(accessToken)
    return forwardHeaders
  }

  private getTraceHeaders(headers: Request['headers']): Document<string> {
    const forwardHeaders: Document<string> = {}
    const correlationId = this.getHeaderValue(headers[CORRELATION_ID])
    forwardHeaders[CORRELATION_ID] = correlationId || randomUUID().toString()
    return forwardHeaders
  }

  private normalizeAuthorization(authorization: string): string {
    if (authorization === EMPTY_VALUE) {
      return EMPTY_VALUE
    }

    return authorization.startsWith(AUTHORIZATION_PREFIX) ? authorization : `${AUTHORIZATION_PREFIX}${authorization}`
  }

  private getHeaderValue(value: string | string[] | undefined): string {
    if (typeof value === 'string') {
      return value.trim()
    }

    if (Array.isArray(value)) {
      return value[FIRST_ITEM_INDEX]?.trim() ?? EMPTY_VALUE
    }

    return EMPTY_VALUE
  }
}
