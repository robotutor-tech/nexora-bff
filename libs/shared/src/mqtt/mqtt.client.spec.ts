import type { MqttClient as MqttJsClient } from 'mqtt'
import { connect as mqttConnect } from 'mqtt'
import { MqttClient } from './mqtt.client'
jest.mock('mqtt')

type HandlerMap = {
  connect?: () => void
  message?: (topic: string, payload: Buffer) => void
}

describe('MqttClient', () => {
  let handlers: HandlerMap
  let fakeClient: Pick<MqttJsClient, 'on' | 'subscribe' | 'publish' | 'end'> & { subscribe: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()
    handlers = {}

    fakeClient = {
      on: jest.fn((event: string, cb: (...args: unknown[]) => void) => {
        if (event === 'connect') {
          handlers.connect = cb as () => void
        }
        if (event === 'message') {
          handlers.message = cb as (topic: string, payload: Buffer) => void
        }
        return fakeClient as unknown as MqttJsClient
      }),
      subscribe: jest.fn(),
      publish: jest.fn(),
      end: jest.fn()
    }

    ;(mqttConnect as unknown as jest.Mock).mockReset()
    ;(mqttConnect as unknown as jest.Mock).mockReturnValue(fakeClient)

    process.env.APPLICATION_NAME = 'BFF-UI'
  })

  afterEach(() => {
    delete process.env.APPLICATION_NAME
  })

  it('should connect and subscribe shared topics on connect, honoring existing callbacks', () => {
    const service = new MqttClient()

    service.onModuleInit()

    expect(mqttConnect as unknown as jest.Mock).toHaveBeenCalledTimes(1)
    expect((mqttConnect as unknown as jest.Mock).mock.calls[0][0]).toBe('mqtt://127.0.0.1:1883')
    expect(fakeClient.on).toHaveBeenCalledWith('connect', expect.any(Function))
    expect(fakeClient.on).toHaveBeenCalledWith('message', expect.any(Function))

    // Register a callback before triggering connect to ensure the connect handler subscribes all topics
    const cb = jest.fn()
    service.subscribe('devices/+/status', cb)
    expect(fakeClient.subscribe).toHaveBeenCalledWith('$share/BFF-UI/devices/+/status')

    handlers.connect?.()

    // After connect, it should subscribe to all registered topics again via shared subscription array
    expect(fakeClient.subscribe).toHaveBeenCalledWith(['$share/BFF-UI/devices/+/status'])
  })

  it('should publish JSON stringified payload with qos=1 and retain=true', () => {
    const service = new MqttClient()
    service.onModuleInit()

    service.publish('sensors/temperature', { value: 22.5 })

    expect(fakeClient.publish).toHaveBeenCalledTimes(1)
    const [topic, message, options] = (fakeClient.publish as jest.Mock).mock.calls[0] as [
      string,
      string,
      { qos: number; retain: boolean }
    ]
    expect(topic).toBe('sensors/temperature')
    expect(() => JSON.parse(message)).not.toThrow()
    expect(JSON.parse(message)).toStrictEqual({ value: 22.5 })
    expect(options).toStrictEqual({ qos: 1, retain: true })
  })

  it('should dispatch message to matching callbacks with parsed payload', () => {
    const service = new MqttClient()
    service.onModuleInit()

    const received: Array<{ topic: string; payload: unknown }> = []
    service.subscribe('devices/+/status', msg => {
      received.push(msg)
    })

    const payload = { ok: true, id: 123 }
    handlers.message?.('devices/abc/status', Buffer.from(JSON.stringify(payload)))

    expect(received).toHaveLength(1)
    expect(received[0]).toStrictEqual({ topic: 'devices/abc/status', payload })
  })

  it('should stop the client on module destroy', () => {
    const service = new MqttClient()
    service.onModuleInit()

    service.onModuleDestroy()

    expect(fakeClient.end).toHaveBeenCalledTimes(1)
  })
})
