import axios from 'axios'
import { Webclient } from './webclient.service'
import type { RequestContextService } from '../service/requestContext.service'

jest.mock('axios')

describe('Webclient', () => {
  let requestContext: Pick<RequestContextService, 'getForwardHeaders'>

  beforeEach(() => {
    jest.clearAllMocks()

    // mock logging chain used by axios wrapper extensions
    if (typeof Promise.prototype.logOnSuccess !== 'function') {
      Object.defineProperty(Promise.prototype, 'logOnSuccess', {
        configurable: true,
        writable: true,
        value: function (this: Promise<unknown>): Promise<unknown> {
          return this
        }
      })
    }
    if (typeof Promise.prototype.logOnError !== 'function') {
      Object.defineProperty(Promise.prototype, 'logOnError', {
        configurable: true,
        writable: true,
        value: function (this: Promise<unknown>): Promise<unknown> {
          return this
        }
      })
    }

    requestContext = {
      getForwardHeaders: () => ({ authorization: 'Bearer token', 'x-trace-id': 'trace-1' })
    }

    jest.replaceProperty(axios, 'interceptors', {
      ...axios.interceptors,
      response: { ...axios.interceptors.response, use: jest.fn() }
    })
    jest.spyOn(axios, 'create').mockReturnValue(axios)
  })

  describe('get', () => {
    it('should build url with path variables, query params and merge headers (excluding content-length)', async () => {
      const data = [{ id: 1 }]
      jest.spyOn(axios, 'get').mockResolvedValue(data)

      const client = new Webclient(requestContext as unknown as RequestContextService)

      const resp = await client.get<Array<{ id: number }>>({
        baseUrl: 'http://api',
        path: '/things/{id}',
        uriVariables: { id: '123' },
        queryParams: { q: 'test' },
        headers: { 'content-length': '99', 'X-Custom': 'A' }
      })

      expect(resp).toStrictEqual(data)
      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith('http://api/things/123?q=test', {
        headers: { 'X-Custom': 'A', authorization: 'Bearer token', 'x-trace-id': 'trace-1' }
      })
    })
  })

  describe('post', () => {
    it('should post body to url and merge forward headers', async () => {
      const body = { name: 'Alice' }
      const data = { id: '1', name: 'Alice' }
      jest.spyOn(axios, 'post').mockResolvedValueOnce(data as unknown as ReturnType<typeof axios.post>)

      const client = new Webclient(requestContext as unknown as RequestContextService)

      const resp = await client.post<typeof data>({ baseUrl: 'http://api', path: '/users', body })

      expect(resp).toStrictEqual(data)
      expect(axios.post).toHaveBeenCalledTimes(1)
      expect(axios.post).toHaveBeenCalledWith('http://api/users', body, {
        headers: { authorization: 'Bearer token', 'x-trace-id': 'trace-1' }
      })
    })
  })
})
