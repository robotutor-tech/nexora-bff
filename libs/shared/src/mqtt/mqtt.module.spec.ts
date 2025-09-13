import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { MqttModule } from './mqtt.module'
import { MqttClient } from './mqtt.client'
import { MqttSubscriberExplorer } from './mqtt.service'

describe('MqttModule', () => {
  let moduleRef: TestingModule

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({ imports: [MqttModule] }).compile()
  })

  it('should resolve MqttClient', () => {
    const client = moduleRef.get(MqttClient)
    expect(client).toBeInstanceOf(MqttClient)
  })

  it('should resolve MqttSubscriberExplorer', () => {
    const explorer = moduleRef.get(MqttSubscriberExplorer)
    expect(explorer).toBeInstanceOf(MqttSubscriberExplorer)
  })
})

