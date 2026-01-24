import { z } from 'zod'
import { NameSchema } from '../../../shared/schema/name.schema'

const ComparisonOperatorSchema = z.enum([
  'GREATER_THAN',
  'LESS_THAN',
  'EQUAL',
  'NOT_EQUAL',
  'GREATER_THAN_OR_EQUAL',
  'LESS_THAN_OR_EQUAL'
])

const FeedControlConfigSchema = z.object({
  type: z.literal('FEED_CONTROL'),
  feedId: z.string().min(1, 'Feed ID is required'),
  operator: ComparisonOperatorSchema,
  value: z.number()
})

const FeedValueConfigSchema = z.object({
  type: z.literal('FEED_VALUE'),
  feedId: z.string().min(1, 'Feed ID is required'),
  value: z.number()
})

const WaitConfigSchema = z.object({
  type: z.literal('WAIT'),
  duration: z.number().min(1, 'Duration must be at least 1 second')
})

const AutomationConfigSchema = z.object({
  type: z.literal('AUTOMATION'),
  automationId: z.string().min(1, 'Automation ID is required')
})

const TimeRangeConfigSchema = z.object({
  type: z.literal('TIME_RANGE'),
  startTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Time must be in hh:mm format (00:00 to 23:59)'),
  endTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Time must be in hh:mm format (00:00 to 23:59)')
})

const VoiceConfigSchema = z.object({
  type: z.literal('VOICE'),
  commands: z.array(z.string().nonempty('command should not be empty')).nonempty('At least one command is required')
})

const SimpleConfigSchema = z.object({
  type: z.enum(['SCHEDULE', 'MANUAL', 'DEVICE_STATE', 'NOTIFICATION'])
})

const ComponentConfigSchema = z.discriminatedUnion('type', [
  FeedControlConfigSchema,
  FeedValueConfigSchema,
  WaitConfigSchema,
  AutomationConfigSchema,
  TimeRangeConfigSchema,
  VoiceConfigSchema,
  SimpleConfigSchema
])

/**
 * Condition node schemas (recursive structure for complex conditions)
 */
type ConditionNode =
  | { type: 'LEAF'; conditionId: string }
  | { type: 'GROUP'; operator: 'AND' | 'OR'; children: ConditionNode[] }
  | { type: 'NOT'; child: ConditionNode }

const ConditionLeafSchema = z.object({
  type: z.literal('LEAF'),
  conditionId: z.string().min(1, 'Condition ID is required')
})

const ConditionGroupSchema = z.object({
  type: z.literal('GROUP'),
  operator: z.enum(['AND', 'OR']),
  children: z.lazy(() => z.array(ConditionNodeSchema))
})

const ConditionNotSchema = z.object({
  type: z.literal('NOT'),
  child: z.lazy(() => ConditionNodeSchema)
})

const ConditionNodeSchema: z.ZodType<ConditionNode> = z.lazy(() =>
  z.discriminatedUnion('type', [
    ConditionLeafSchema,
    ConditionGroupSchema,
    ConditionNotSchema
  ])
) as z.ZodType<ConditionNode>

export const CreateAutomationSchema = z
  .object({
    name: NameSchema,
    description: z.string().max(500, 'Description must be at most 500 characters').optional(),
    triggers: z.array(ComponentConfigSchema).min(1, 'At least one trigger is required'),
    actions: z.array(ComponentConfigSchema).min(1, 'At least one action is required'),
    condition: ConditionNodeSchema.optional(),
    executionMode: z.enum(['MULTIPLE', 'SINGLE', 'REPLACE']).default('SINGLE')
  })
  .strict()

export type CreateAutomationSchemaType = z.infer<typeof CreateAutomationSchema>
