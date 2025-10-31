export type Automation = {
  automationId: string
  executionMode?: ExecutionMode
  triggers: string[]
  actions: string[]
  condition?: ConditionNode
  name: string
  description?: string
}

export type ExecutionMode = 'MULTIPLE' | 'SINGLE' | 'REPLACE'
