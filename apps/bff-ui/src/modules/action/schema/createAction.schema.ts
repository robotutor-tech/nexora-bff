import { z } from 'zod'

const validateActionConfig = (config: z.infer<typeof CreateActionSchema>['config']) => {
  switch (config.type) {
    case 'FEED_CONTROL':
      return FeedControlActionConfigSchema.safeParse(config)
    case 'WAIT':
      return WaitActionConfigSchema.safeParse(config)
    case 'AUTOMATION_TRIGGER':
      return AutomationActionConfigSchema.safeParse(config)
    default:
      return null
  }
}

const FeedControlActionConfigSchema = z
  .object({
    type: z.enum(['FEED_CONTROL']),
    feedId: z.string().nonempty('Feed Id is required'),
    value: z.number({ message: 'Number is required' })
  })
  .strict()

const WaitActionConfigSchema = z
  .object({
    type: z.enum(['WAIT']),
    duration: z.number().min(1, 'Duration must be >= 1').max(120, 'Duration minutes must be <= 120')
  })
  .strict()

const AutomationActionConfigSchema = z
  .object({
    type: z.enum(['AUTOMATION_TRIGGER']),
    automationId: z.string().nonempty('Automation Id is required')
  })
  .strict()

export const CreateActionSchema = z
  .object({
    name: z.string().nonempty('Name is required'),
    description: z.string().optional(),
    config: z.object({ type: z.enum(['FEED_CONTROL', 'WAIT', 'AUTOMATION_TRIGGER']) }).catchall(z.any())
  })
  .strict()
  .superRefine((data, ctx) => {
    const result = validateActionConfig(data.config)
    if (!result) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid action type' })
    } else if (result.error) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ ...issue, path: ['config', ...issue.path] })
      }
    }
  })
