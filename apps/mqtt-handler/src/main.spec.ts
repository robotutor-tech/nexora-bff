import type { INestApplication } from '@nestjs/common'

describe('mqtt-handler bootstrap (main.ts)', () => {
  const makeAppMock = () => {
    return {
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

  it('should set global prefix and listen on env port', async () => {
    const appMock = makeAppMock()
    mockNestFactoryCreate(appMock)

    process.env.port = '3200'

    const { AppModule } = await import('./mqtt-handler.module')
    await import('./main')

    const { NestFactory } = (await import('@nestjs/core')) as unknown as { NestFactory: { create: jest.Mock } }

    expect(NestFactory.create).toHaveBeenCalledTimes(1)
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule)

    expect((appMock ).setGlobalPrefix).toHaveBeenCalledWith('api')
    expect((appMock ).listen).toHaveBeenCalledWith('3200')
  })

  it('should listen on default port 3003 when env port is not set', async () => {
    const appMock = makeAppMock()
    mockNestFactoryCreate(appMock)

    const { AppModule } = await import('./mqtt-handler.module')
    await import('./main')

    const { NestFactory } = (await import('@nestjs/core')) as unknown as { NestFactory: { create: jest.Mock } }

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule)
    expect((appMock ).setGlobalPrefix).toHaveBeenCalledWith('api')
    expect((appMock ).listen).toHaveBeenCalledWith(3003)
  })
})

