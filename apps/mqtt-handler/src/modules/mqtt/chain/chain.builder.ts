import { Injectable, Scope } from '@nestjs/common'
import { BaseHandler } from '../handlers/base.handler'

@Injectable({ scope: Scope.TRANSIENT })
export class ChainBuilder {
  private chain: BaseHandler[] = []

  add(handler: BaseHandler): ChainBuilder {
    if (this.chain.includes(handler)) {
      throw new Error('Handler already added')
    }
    this.chain.push(handler)
    return this
  }

  build<TInput = unknown, TOutput = unknown>(): BaseHandler<TInput, TOutput> {
    if (this.chain.length === 0) {
      throw new Error('No handlers added')
    }
    for (let index = 1; index < this.chain.length; index++) {
      this.chain[index - 1].setNext(this.chain[index])
    }
    const chainHead = this.chain[0]
    this.chain = []
    return chainHead as BaseHandler<TInput, TOutput>
  }
}
