import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class KafkaLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = context.switchToRpc().getData()
    this.logger.log(`📥 Incoming Kafka message: ${JSON.stringify(data)}`)

    return next.handle().pipe(
      tap(result => {
        this.logger.log(`✅ Processed Kafka message result: ${JSON.stringify(result)}`)
      })
    )
  }
}
