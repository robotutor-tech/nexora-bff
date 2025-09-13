import type { INestApplication } from '@nestjs/common'

describe('bff-iot bootstrap (main.ts)', () => {
  const makeAppMock = () => {
    return {
      connectMicroservice: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined)
    } as unknown as INestApplication
  }

  const mockNestFactoryCreate = (appMock: INestApplication) => {
    jest.doMock('@nestjs/core', () => ({
      NestFactory: { create: jest.fn().mockResolvedValue(appMock) }
    }))
  }

  afterEach(() => {
    jest.resetModules()
    delete (process.env as Record<string, unknown>).port
    jest.clearAllMocks()
  })

  it('should connect Kafka microservice, set global prefix, and listen on env port', async () => {
    const appMock = makeAppMock()
    mockNestFactoryCreate(appMock)

    // set env port BEFORE importing main.ts
    process.env.port = '4000'

    const { AppModule } = await import('./bff-iot.module')
    const { KafkaConfig } = await import('@shared/kafka/kafka.config')

    await import('./main')

    const { NestFactory } = await import('@nestjs/core') as unknown as { NestFactory: { create: jest.Mock } }

    expect(NestFactory.create).toHaveBeenCalledTimes(1)
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule)

    expect((appMock ).connectMicroservice).toHaveBeenCalledTimes(1)
    expect((appMock ).connectMicroservice).toHaveBeenCalledWith(KafkaConfig)

    expect((appMock ).setGlobalPrefix).toHaveBeenCalledWith('api')
    expect((appMock ).listen).toHaveBeenCalledWith('4000')
  })

  it('should listen on default port 3002 when env port is not set', async () => {
    const appMock = makeAppMock()
    mockNestFactoryCreate(appMock)

    const { AppModule } = await import('./bff-iot.module')
    const { KafkaConfig } = await import('@shared/kafka/kafka.config')

    await import('./main')

    const { NestFactory } = await import('@nestjs/core') as unknown as { NestFactory: { create: jest.Mock } }

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule)
    expect((appMock ).connectMicroservice).toHaveBeenCalledWith(KafkaConfig)
    expect((appMock ).setGlobalPrefix).toHaveBeenCalledWith('api')
    expect((appMock ).listen).toHaveBeenCalledWith(3002)
  })
})

