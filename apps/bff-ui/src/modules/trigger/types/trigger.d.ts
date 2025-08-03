export type Trigger<T extends TriggerType = TriggerType> = {
  name: string
  description?: string
  config: TriggerConfig<T>
  triggerId: string
}

type TriggerConfigMaps = {
  SCHEDULE: ScheduleTriggerConfig
  VOICE: VoiceTriggerConfig
  FEED: FeedTriggerConfig
}
export type TriggerType = keyof TriggerConfigMaps
export type TriggerConfig<T extends TriggerType = TriggerType> = TriggerConfigMaps[T] & { type: T }

export type ScheduleTriggerConfig<T extends ScheduleType = ScheduleType> = {
  config: ScheduleConfigMap[T] & { type: T }
  repeat: DayOfWeek[]
}

interface ScheduleConfigMap {
  SUN: SunTriggerConfig
  TIME: TimeTriggerConfig
}

export type ScheduleType = keyof ScheduleConfigMap

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Hour = `0${Digit}` | `1${Digit}` | `2${'0' | '1' | '2' | '3'}`
type Minute = `${'0' | '1' | '2' | '3' | '4' | '5'}${Digit}`
export type TimeFormat = `${Hour}:${Minute}`
export type TimeTriggerConfig = { time: TimeFormat }

export type SunTriggerConfig = {
  event: SunEvent
  offsetMinutes: number
}

export type VoiceTriggerConfig = { commands: string[] }
export type FeedTriggerConfig = {
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
