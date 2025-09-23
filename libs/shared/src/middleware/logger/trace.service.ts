import { Injectable } from '@nestjs/common'
import { AsyncLocalStorage } from 'async_hooks'

@Injectable()
export class TraceService {
  private readonly als = new AsyncLocalStorage<Map<string, string>>()

  run(traceId: string, fn: () => void) {
    const store = new Map<string, string>()
    store.set('traceId', traceId)
    this.als.run(store, fn)
  }

  get traceId(): string | undefined {
    return this.als.getStore()?.get('traceId')
  }
}
