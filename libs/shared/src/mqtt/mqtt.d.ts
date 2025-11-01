export type MqttPayload<T = unknown> = { topic: string; payload: T; clientId: string }
export type MqttCallback = (data: MqttPayload) => Promise<void>
