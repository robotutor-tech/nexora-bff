export type Rule<T extends RuleType = RuleType> = {
  ruleId: string
  name: string
  description?: string
  type: 'ACTION' | 'TRIGGER' | 'CONDITION'
  config: RuleConfig<T>
}

type RuleConfigMaps = {
  SCHEDULE: ScheduleRuleConfig
  VOICE: VoiceRuleConfig
  FEED: FeedRuleConfig
}
export type RuleType = keyof RuleConfigMaps
export type RuleConfig<T extends RuleType = RuleType> = RuleConfigMaps[T] & { type: T }

export type ScheduleRuleConfig<T extends ScheduleType = ScheduleType> = {
  config: ScheduleConfigMap[T] & { type: T }
  repeat: DayOfWeek[]
}

interface ScheduleConfigMap {
  SUN: SunRuleConfig
  TIME: TimeRuleConfig
}

export type ScheduleType = keyof ScheduleConfigMap

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Hour = `0${Digit}` | `1${Digit}` | `2${'0' | '1' | '2' | '3'}`
type Minute = `${'0' | '1' | '2' | '3' | '4' | '5'}${Digit}`
export type TimeFormat = `${Hour}:${Minute}`
export type TimeRuleConfig = { time: TimeFormat }

export type SunRuleConfig = {
  event: SunEvent
  offsetMinutes: number
}

export type VoiceRuleConfig = { commands: string[] }
export type FeedRuleConfig = {
  feedId: string
  operator: ComparisonOperator
  value: number
}

enum SunEvent {
  SUNRISE = 'SUNRISE',
  SUNSET = 'SUNSET'
}

type ComparisonOperator =
  | 'GREATER_THAN'
  | 'LESS_THAN'
  | 'EQUAL'
  | 'NOT_EQUAL'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN_OR_EQUAL'
