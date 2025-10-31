import { z } from 'zod'
import { NameSchema } from '../../../shared/schema/name.schema'

const ruleTypeConfigTypeMapping = {
  ACTION: ['WAIT', 'FEED_VALUE'],
  TRIGGER: ['VOICE', 'FEED_CONTROL', 'SCHEDULE'],
  CONDITION: ['TIME_RANGE', 'FEED_CONTROL']
} as const

const validateRuleConfig = (config: z.infer<typeof CreateRuleSchema>['config']) => {
  switch (config.type) {
    case 'SCHEDULE':
      return ScheduleRuleConfigSchema.safeParse(config)
    case 'VOICE':
      return VoiceRuleConfigSchema.safeParse(config)
    case 'FEED_CONTROL':
      return FeedControlRuleConfigSchema.safeParse(config)
    case 'WAIT':
      return WaitRuleConfigSchema.safeParse(config)
    case 'FEED_VALUE':
      return FeedValueRuleConfigSchema.safeParse(config)
    case 'TIME_RANGE':
      return TimeRangeRuleConfigSchema.safeParse(config)
    default:
      return null
  }
}

const validateScheduleRuleConfig = (config: z.infer<typeof ScheduleRuleConfigSchema>['config']) => {
  switch (config.type) {
    case 'SUN':
      return SunScheduleRuleConfigSchema.safeParse(config)
    case 'TIME':
      return TimeScheduleRuleConfigSchema.safeParse(config)
    default:
      return null
  }
}

const ScheduleRuleConfigSchema = z
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
    const result = validateScheduleRuleConfig(data.config)
    if (!result) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid trigger type' })
    } else if (result.error) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ ...issue, path: ['config.config', ...issue.path] })
      }
    }
  })

const SunScheduleRuleConfigSchema = z
  .object({
    type: z.enum(['SUN']),
    event: z.enum(['SUNSET', 'SUNRISE'], { message: 'Sun Schedule event must be either SUNRISE or SUNSET.' }),
    offsetMinutes: z.number().min(-60, 'Offset minutes must be >= -60').max(60, 'Offset minutes must be <= 60')
  })
  .strict()

const TimeScheduleRuleConfigSchema = z
  .object({
    type: z.enum(['TIME']),
    time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Time must be in hh:mm format (00:00 to 23:59)')
  })
  .strict()

const VoiceRuleConfigSchema = z
  .object({
    type: z.enum(['VOICE']),
    commands: z.array(z.string()).min(1, 'At least 1 command required')
  })
  .strict()

const FeedValueRuleConfigSchema = z
  .object({
    type: z.enum(['FEED_VALUE']),
    feedId: z.string().regex(/^\d+$/, { message: 'feedId must be a string containing only numeric digits (0-9).' }),
    value: z
      .string()
      .regex(/^\d+$/, { message: 'value must be a string containing only numeric digits (0-9).' })
      .refine(value => Number(value) >= 0 && Number(value) <= 100, {
        message: 'value must be a positive number between 0 and 100.'
      })
  })
  .strict()

const FeedControlRuleConfigSchema = z
  .object({
    type: z.enum(['FEED_CONTROL']),
    feedId: z.string().regex(/^\d+$/, { message: 'feedId must be a string containing only numeric digits (0-9).' }),
    operator: z.enum([
      'GREATER_THAN',
      'LESS_THAN',
      'EQUAL',
      'NOT_EQUAL',
      'GREATER_THAN_OR_EQUAL',
      'LESS_THAN_OR_EQUAL'
    ]),
    value: z
      .string()
      .regex(/^\d+$/, { message: 'value must be a string containing only numeric digits (0-9).' })
      .refine(value => Number(value) >= 0 && Number(value) <= 100, {
        message: 'value must be a positive number between 0 and 100.'
      })
  })
  .strict()

const TimeRangeRuleConfigSchema = z
  .object({
    type: z.enum(['TIME_RANGE']),
    startTime: z.string(),
    endTime: z.string()
  })
  .strict()

const WaitRuleConfigSchema = z
  .object({
    type: z.enum(['WAIT']),
    duration: z.string()
  })
  .strict()

export const CreateRuleSchema = z
  .object({
    name: NameSchema,
    description: z.string().optional(),
    type: z.enum(Object.keys(ruleTypeConfigTypeMapping) as [string, ...string[]], { message: 'Type is required' }),
    config: z
      .object({
        type: z.enum(Object.values(ruleTypeConfigTypeMapping).flatMap(value => value) as [string, ...string[]], {
          message: 'Config.Type is required'
        })
      })
      .catchall(z.any({ message: 'Config is required' }))
  })
  .strict()
  .superRefine((data, ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (!ruleTypeConfigTypeMapping[data.type].includes(data.config.type)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid rule type and config type combination' })
      return
    }
    const result = validateRuleConfig(data.config)
    if (!result) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid trigger type' })
    } else if (result.error) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ ...issue, path: ['config', ...issue.path] })
      }
    }
  })
