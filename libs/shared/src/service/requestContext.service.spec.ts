import type { Request } from 'express'
import { RequestContextService } from './requestContext.service'

describe('RequestContextService', () => {
  const make = (headers: Record<string, string | undefined>) =>
    new RequestContextService({ headers } as unknown as Request)

  it('should forward authorization and x-trace-id headers when present', () => {
    const svc = make({ authorization: 'Bearer abc', 'x-trace-id': 'trace-1' })

    const headers = svc.getForwardHeaders()

    expect(headers).toStrictEqual({ authorization: 'Bearer abc', 'x-trace-id': 'trace-1' })
  })

  it('should fallback to empty strings when headers are absent', () => {
    const svc = make({})

    const headers = svc.getForwardHeaders()

    expect(headers).toStrictEqual({ authorization: '', 'x-trace-id': '' })
  })
})

