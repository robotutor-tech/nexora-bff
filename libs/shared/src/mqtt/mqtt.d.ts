export type Document = Record<string, unknown>
export type MqttPayload<T extends Document = Document> = { topic: string; payload: T; clientId: string }
export type MqttCallback = (data: MqttPayload) => void
