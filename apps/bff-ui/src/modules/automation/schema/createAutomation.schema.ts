import { z } from 'zod'
import { NameSchema } from '../../../shared/schema/name.schema'

const validateAutomationConfig = (data: z.infer<typeof CreateAutomationSchema>['config']) => {
  switch (data.type) {
    case 'FEED':
      return FeedAutomationConfigSchema.safeParse(data)
    case 'TIME_RANGE':
      return TimeRangeAutomationConfigSchema.safeParse(data)
    default:
      return null
  }
}

const FeedAutomationConfigSchema = z
  .object({
    type: z.enum(['FEED']),
    feedId: z.string().nonempty('Feed Id is required'),
    operator: z.enum([
      'GREATER_THAN',
      'LESS_THAN',
      'EQUAL',
      'NOT_EQUAL',
      'GREATER_THAN_OR_EQUAL',
      'LESS_THAN_OR_EQUAL'
    ]),
    value: z.number({ message: 'Number is required' })
  })
  .strict()

const TimeRangeAutomationConfigSchema = z
  .object({
    type: z.enum(['TIME_RANGE']),
    startTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Time must be in hh:mm format (00:00 to 23:59)'),
    endTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Time must be in hh:mm format (00:00 to 23:59)')
  })
  .strict()
  .refine(data => data.startTime !== data.endTime, {
    message: 'Start time and End time should not be the same',
    path: ['endTime']
  })

export const CreateAutomationSchema = z
  .object({
    name: NameSchema,
    description: z.string().optional(),
    config: z.object({ type: z.enum(['FEED', 'TIME_RANGE']) }).catchall(z.any())
  })
  .strict()
  .superRefine((data, ctx) => {
    const result = validateAutomationConfig(data.config)
    if (!result) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid condition type' })
    } else if (result.error) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ ...issue, path: ['config', ...issue.path] })
      }
    }
  })
