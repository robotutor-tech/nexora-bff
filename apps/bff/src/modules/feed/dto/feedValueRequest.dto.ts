import { createZodDto } from 'nestjs-zod'
import type { z } from 'zod'
import { FeedValueSchema } from '../schema/feedValue.schema'

export class FeedValueDto extends createZodDto(FeedValueSchema) {}

export type FeedValueRequest = z.infer<typeof FeedValueSchema>
