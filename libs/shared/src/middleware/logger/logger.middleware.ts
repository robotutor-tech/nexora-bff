import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { CORRELATION_ID } from '@shared/middleware/attach-correlation-id/attach-trace-id.middleware'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name)
  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = new Date()
    const correlationId = req.headers[CORRELATION_ID] as string
    const searchableFields = { 'correlation-id': correlationId }
    this.logger.log(`Received Request ${JSON.stringify({ method: req.method, url: req.url, searchableFields })}`)
    const send = res.send
    let isLogged = false

    res.send = function (data: Record<string, unknown>) {
      const responseTime: number = new Date().getTime() - startTime.getTime()
      const logger = new Logger(LoggerMiddleware.name)
      if (!isLogged) {
        logger.log(
          `Response for the request ${JSON.stringify({
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime,
            searchableFields
          })}`
        )
        isLogged = true
      }
      res.header('response-time', `${responseTime}ms`)
      res.header('correlation-id', correlationId)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return send.call(this, data)
    }
    next()
  }
}
