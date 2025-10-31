import { MqttConfig } from './mqtt.config'

describe('MqttConfig', () => {
  const oldEnv = { ...process.env }

  afterEach(() => {
    process.env = { ...oldEnv }
  })

  it('should use defaults when env vars are not set', () => {
    delete process.env.MQTT_HOST
    delete process.env.MQTT_PORT
    delete process.env.MQTT_PASSWORD
    delete process.env.APPLICATION_NAME

    expect(MqttConfig).toStrictEqual({
      protocol: 'mqtt',
      host: 'localhost',
      port: 1883,
      protocolVersion: 5,
      username: 'application',
      password: 'password',
      clientId: 'application'
    })
  })

  it('should reflect environment overrides', () => {
    process.env.MQTT_HOST = 'emqx'
    process.env.MQTT_PORT = '1884'
    process.env.MQTT_PASSWORD = 'secret'
    process.env.APPLICATION_NAME = 'BFF-UI'

    // Re-import to pick up env at module evaluation time
    jest.resetModules()
     
    const fresh = require('./mqtt.config') as { MqttConfig: typeof MqttConfig }

    expect(fresh.MqttConfig).toStrictEqual({
      protocol: 'mqtt',
      host: 'emqx',
      port: 1884,
      protocolVersion: 5,
      username: 'BFF-UI',
      password: 'secret',
      clientId: 'BFF-UI'
    })
  })
})

