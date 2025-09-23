export abstract class BaseHandler<CInput = unknown, COutput = unknown, NInput = CInput, NOutput = COutput> {
  private nextHandler: BaseHandler<NInput, NOutput> | undefined

  setNext(handler: BaseHandler<NInput, NOutput>): BaseHandler<NInput, NOutput> {
    this.nextHandler = handler
    return handler
  }

  abstract handle(input: CInput): Promise<COutput>

  next(input: NInput): Promise<NOutput> {
    if (!this.nextHandler) {
      throw new Error('No handler found')
    }
    return this.nextHandler.handle(input)
  }
}
