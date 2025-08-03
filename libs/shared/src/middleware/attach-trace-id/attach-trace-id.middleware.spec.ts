import { AttachTraceIdMiddleware } from './attach-trace-id.middleware'

describe('AttachTraceIdMiddleware', () => {
  it('should be defined', () => {
    expect(new AttachTraceIdMiddleware()).toBeDefined()
  })
})
