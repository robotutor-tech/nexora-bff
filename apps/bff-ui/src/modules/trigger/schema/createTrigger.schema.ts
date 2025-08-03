import { z } from 'zod'

const validateTriggerConfig = (config: z.infer<typeof CreateTriggerSchema>['config']) => {
  switch (config.type) {
    case 'SCHEDULE':
      return ScheduleTriggerConfigSchema.safeParse(config)
    case 'VOICE':
      return VoiceTriggerConfigSchema.safeParse(config)
    case 'FEED':
      return FeedTriggerConfigSchema.safeParse(config)
    default:
      return null
  }
}

const validateScheduleTriggerConfig = (config: z.infer<typeof ScheduleTriggerConfigSchema>['config']) => {
  switch (config.type) {
    case 'SUN':
      return SunScheduleTriggerConfigSchema.safeParse(config)
    case 'TIME':
      return TimeScheduleTriggerConfigSchema.safeParse(config)
    default:
      return null
  }
}

const ScheduleTriggerConfigSchema = z
  .object({
    type: z.enum(['SCHEDULE'], { message: 'config.type should be SCHEDULED' }),
    repeat: z
      .array(
        z.enum(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'], {
          message: 'Schedule repeat must be days of week'
        }),
        { message: 'Schedule repeat is required' }
      )
      .nonempty('Schedule repeat is required'),
    config: z
      .object({ type: z.enum(['SUN', 'TIME'], { message: 'Schedule type must be either SUN or TIME.' }) })
      .catchall(z.any({ message: 'Required config.config' }))
  })
  .strict()
  .superRefine((data, ctx) => {
    const result = validateScheduleTriggerConfig(data.config)
    if (!result) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid trigger type' })
    } else if (result.error) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ ...issue, path: ['config.config', ...issue.path] })
      }
    }
  })

const SunScheduleTriggerConfigSchema = z
  .object({
    type: z.enum(['SUN']),
    event: z.enum(['SUNSET', 'SUNRISE'], { message: 'Sun Schedule event must be either SUNRISE or SUNSET.' }),
    offsetMinutes: z.number().min(-120, 'Offset minutes must be >= -120').max(120, 'Offset minutes must be <= 120')
  })
  .strict()

const TimeScheduleTriggerConfigSchema = z
  .object({
    type: z.enum(['TIME']),
    time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Time must be in hh:mm format (00:00 to 23:59)')
  })
  .strict()

const VoiceTriggerConfigSchema = z
  .object({
    type: z.enum(['VOICE']),
    commands: z.array(z.string()).min(1, 'At least 1 command required')
  })
  .strict()

const FeedTriggerConfigSchema = z
  .object({
    type: z.enum(['FEED']),
    feedId: z.string().regex(/^\d+$/, { message: 'feedId must be a string containing only numeric digits (0-9).' }),
    operator: z.enum([
      'GREATER_THAN',
      'LESS_THAN',
      'EQUAL',
      'NOT_EQUAL',
      'GREATER_THAN_OR_EQUAL',
      'LESS_THAN_OR_EQUAL'
    ]),
    value: z.number()
  })
  .strict()

export const CreateTriggerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name should not be less than 2 characters')
      .max(30, 'Name should not be more than 30 characters'),
    description: z.string().optional(),
    config: z.object({ type: z.enum(['SCHEDULE', 'VOICE', 'FEED']) }).catchall(z.any({ message: 'Config is required' }))
  })
  .strict()
  .superRefine((data, ctx) => {
    const result = validateTriggerConfig(data.config)
    if (!result) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid trigger type' })
    } else if (result.error) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ ...issue, path: ['config', ...issue.path] })
      }
    }
  })
