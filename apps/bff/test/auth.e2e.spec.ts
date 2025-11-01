import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/bff.module'
import { Webclient, apiConfig } from '@shared'

jest.mock('logging-starter')
describe('Auth Module (e2e)', () => {
  let app: INestApplication
  let webclient: jest.Mocked<Webclient>

  beforeEach(async () => {
    webclient = { post: jest.fn(), get: jest.fn() } as unknown as jest.Mocked<Webclient>

    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(Webclient)
      .useValue(webclient)
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
    jest.clearAllMocks()
  })

  describe('POST /auth/login', () => {
    it('should 400 on invalid email', async () => {
      const dto = { email: 'bad', password: 'Password1' }
      const res = await request(app.getHttpServer()).post('/auth/login').send(dto).expect(400)
      expect(res.body).toMatchObject({ errorCode: 'NEXORA-0101', message: 'Validation error' })
      expect(webclient.post).not.toHaveBeenCalled()
    })

    it('should 201 and return tokens', async () => {
      const dto = { email: 'a@b.com', password: 'Password1' }
      const tokens = { token: 't', refreshToken: 'rt' }
      webclient.post.mockResolvedValueOnce(tokens as unknown)
      const res = await request(app.getHttpServer()).post('/auth/login').send(dto).expect(201)
      expect(res.body).toStrictEqual(tokens)
      expect(webclient.post).toHaveBeenCalledWith({
        baseUrl: apiConfig.auth.baseUrl,
        path: apiConfig.auth.login,
        body: dto
      })
    })
  })

  describe('POST /auth/login/actor', () => {
    it('should 400 on invalid payload', async () => {
      const dto = { actorId: 1, roleId: 'r-1' }
      const res = await request(app.getHttpServer()).post('/auth/login/actor').send(dto).expect(400)
      expect(res.body).toMatchObject({ errorCode: 'NEXORA-0101', message: 'Validation error' })
      expect(webclient.post).not.toHaveBeenCalled()
    })

    it('should 201 and return tokens', async () => {
      const dto = { actorId: 'a-1', roleId: 'r-1' }
      const tokens = { token: 't2', refreshToken: 'rt2' }
      webclient.post.mockResolvedValueOnce(tokens)
      const res = await request(app.getHttpServer()).post('/auth/login/actor').send(dto).expect(201)
      expect(res.body).toStrictEqual(tokens)
      expect(webclient.post).toHaveBeenCalledWith({
        baseUrl: apiConfig.auth.baseUrl,
        path: apiConfig.auth.actorLogin,
        body: dto
      })
    })
  })

  describe('GET /auth/validate', () => {
    it('should 200 and return validated user', async () => {
      const payload = { tokenIdentifier: 'AUTH_USER' }
      webclient.get.mockResolvedValueOnce(payload)
      const res = await request(app.getHttpServer()).get('/auth/validate').expect(200)
      expect(res.body).toStrictEqual(payload)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.auth.baseUrl, path: apiConfig.auth.validate })
    })
  })

  describe('GET /auth/refresh', () => {
    it('should 200 and return tokens', async () => {
      const tokens = { token: 't3', refreshToken: 'rt3' }
      webclient.get.mockResolvedValueOnce(tokens)
      const res = await request(app.getHttpServer()).get('/auth/refresh').expect(200)
      expect(res.body).toStrictEqual(tokens)
      expect(webclient.get).toHaveBeenCalledWith({ baseUrl: apiConfig.auth.baseUrl, path: apiConfig.auth.refresh })
    })
  })
})
