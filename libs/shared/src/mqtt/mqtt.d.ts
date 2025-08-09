export type Document = Record<string, unknown>
export type MqttPayload<T extends Document = Document> = { topic: string; payload: T }
export type MqttCallback = (data: MqttPayload) => void
