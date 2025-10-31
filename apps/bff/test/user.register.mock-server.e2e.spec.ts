import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as http from 'http'
import * as request from 'supertest'

jest.mock('logging-starter')

describe('User Register (e2e) with mock server', () => {
  let app: INestApplication | undefined
  let mockServer: http.Server
  let port: number
  let lastRequestBody: any
  let lastRequestPath: string | undefined
  let lastRequestMethod: string | undefined

  beforeEach(async () => {
    lastRequestBody = undefined
    lastRequestPath = undefined
    lastRequestMethod = undefined

    mockServer = http.createServer((req, res) => {
      lastRequestPath = req.url ?? undefined
      lastRequestMethod = req.method ?? undefined

      if (req.method === 'POST' && req.url === '/users') {
        const chunks: Buffer[] = []
        req.on('data', chunk => chunks.push(chunk as Buffer))
        req.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8')
          try {
            lastRequestBody = raw ? JSON.parse(raw) : {}
          } catch {
            lastRequestBody = raw
          }
          const user = {
            userId: '0000000001',
            name: lastRequestBody?.name,
            email: lastRequestBody?.email,
            mobile: lastRequestBody?.mobile,
            isEmailVerified: false,
            isMobileVerified: false,
            registeredAt: '2023-01-01T00:00:00.000Z'
          }
          res.statusCode = 201
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(user))
        })
        return
      }

      res.statusCode = 404
      res.end()
    })

    await new Promise<void>(resolve => mockServer.listen(0, resolve))
    const address = mockServer.address()
    if (!address || typeof address === 'string') {
      throw new Error('Failed to bind mock server')
    }
    port = address.port

    process.env.AUTH_SERVICE_BASE_URL = `http://127.0.0.1:${port}`
    jest.resetModules()

    const { AppModule } = await import('../src/bff-ui.module')

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    if (app) {
      await app.close()
      app = undefined
    }
    await new Promise<void>(resolve => mockServer.close(() => {
      resolve() 
    }))
    delete process.env.AUTH_SERVICE_BASE_URL
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('POST /users/register should forward to mock server and return 201 with user payload', async () => {
    if (!app) {
      throw new Error('app not initialized')
    }
    const dto = { name: 'Alice Example', email: 'alice@example.com', password: 'Password1', mobile: '9123456789' }

    const res = await request(app.getHttpServer()).post('/users/register').send(dto).expect(201)

    expect(res.body).toMatchObject({
      userId: '0000000001',
      name: dto.name,
      email: dto.email,
      mobile: dto.mobile,
      isEmailVerified: false,
      isMobileVerified: false,
      registeredAt: '2023-01-01T00:00:00.000Z'
    })

    expect(lastRequestMethod).toBe('POST')
    expect(lastRequestPath).toBe('/users')
    expect(lastRequestBody).toEqual({ name: dto.name, email: dto.email, password: dto.password, mobile: dto.mobile })
  })

  it('should validate input and return 400 when email is invalid (mock server not called)', async () => {
    if (!app) {
      throw new Error('app not initialized')
    }
    const dto = { name: 'Alice Example', email: 'not-an-email', password: 'Password1', mobile: '9123456789' }

    await request(app.getHttpServer()).post('/users/register').send(dto).expect(400)

    expect(lastRequestMethod).toBeUndefined()
    expect(lastRequestPath).toBeUndefined()
    expect(lastRequestBody).toBeUndefined()
  })
})

