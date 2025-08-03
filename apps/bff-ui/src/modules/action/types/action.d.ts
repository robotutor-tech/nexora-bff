export type Action<T extends ActionType = ActionType> = {
  name: string
  description?: string
  config: ActionConfig<T>
  actionId: string
}

type ActionConfigMaps = {
  SCHEDULE: ScheduleActionConfig
  VOICE: VoiceActionConfig
  FEED: FeedActionConfig
}
export type ActionType = keyof ActionConfigMaps
export type ActionConfig<T extends ActionType = ActionType> = ActionConfigMaps[T] & { type: T }

export type ScheduleActionConfig<T extends ScheduleType = ScheduleType> = {
  config: ScheduleConfigMap[T] & { type: T }
  repeat: DayOfWeek[]
}

interface ScheduleConfigMap {
  SUN: SunActionConfig
  TIME: TimeActionConfig
}

export type ScheduleType = keyof ScheduleConfigMap

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Hour = `0${Digit}` | `1${Digit}` | `2${'0' | '1' | '2' | '3'}`
type Minute = `${'0' | '1' | '2' | '3' | '4' | '5'}${Digit}`
export type TimeFormat = `${Hour}:${Minute}`
export type TimeActionConfig = { time: TimeFormat }

export type SunActionConfig = {
  event: SunEvent
  offsetMinutes: number
}

export type VoiceActionConfig = { commands: string[] }
export type FeedActionConfig = {
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
