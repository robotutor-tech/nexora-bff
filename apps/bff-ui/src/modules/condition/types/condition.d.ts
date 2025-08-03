import type { ComparisonOperator, TimeFormat } from '@/types/trigger'

export type Condition<T extends ConditionType = ConditionType> = {
  conditionId: string
  name: string
  description?: string
  type: T
  config: ConditionConfig<T>
}

type ConditionConfigMaps = {
  FEED: FeedConditionConfig
  TIME_RANGE: TimeRangeConditionConfig
}
export type ConditionType = keyof ConditionConfigMaps
export type ConditionConfig<T extends ConditionType = ConditionType> = ConditionConfigMaps[T]

export type FeedConditionConfig = { feedId: string; value: number; operator: ComparisonOperator }

export type TimeRangeConditionConfig = { startTime: TimeFormat; endTime: TimeFormat }
