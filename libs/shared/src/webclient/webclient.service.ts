import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import axios, { AxiosError, AxiosInstance } from 'axios'
import type { GetRequest, PostRequest, WebClientRequest } from './webclient'
import { Document } from '../types/types'
import { RequestContextService } from '../service/requestContext.service'
import { ApiConfig } from '@shared/config/config'

@Injectable()
export class Webclient {
  private readonly axiosInstance: AxiosInstance
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly requestContextService: RequestContextService) {
    this.axiosInstance = axios.create({ baseURL: ApiConfig.baseUrl, timeout: 5000 })
    this.axiosInstance.interceptors.response.use(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      response => response.data,
      (error: AxiosError): void => {
        throw new HttpException(
          error.response?.data ?? {
            errorCode: 'NEXORA-0101',
            message: 'Something went wrong'
          },
          error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
    )
  }

  request<ReturnType>({
    method,
    path,
    body,
    queryParams,
    uriVariables,
    headers = {}
  }: WebClientRequest): Promise<ReturnType> {
    const url = this.createUrl(path, queryParams, uriVariables)
    const startTime = new Date().getTime()
    return this.axiosInstance
      .request<ReturnType>({ method, url, data: body, headers: this.parseHeaders(headers) })
      .then(response => {
        const endTime = new Date().getTime()
        const responseTime = endTime - startTime
        this.logger.log(`Successfully get api response for ${JSON.stringify({ responseTime, url, headers })}`)
        return response
      })
      .catch(error => {
        this.logger.error(`Failed to get api response for ${JSON.stringify({ url, headers, error })}`)
        throw error
      }) as Promise<ReturnType>
  }

  get<ReturnType>({ path, queryParams, uriVariables, headers = {} }: GetRequest): Promise<ReturnType> {
    const url = this.createUrl(path, queryParams, uriVariables)
    const startTime = new Date().getTime()
    return this.axiosInstance
      .get<ReturnType>(url, {
        headers: this.parseHeaders(headers)
      })
      .then(response => {
        const endTime = new Date().getTime()
        const responseTime = endTime - startTime
        this.logger.log(`Successfully get GET api response ${JSON.stringify({ responseTime, url, headers })}`)
        return response
      })
      .catch(error => {
        this.logger.error(`Failed to get GET API response ${JSON.stringify({ url, headers, error })}`)
        throw error
      }) as Promise<ReturnType>
  }

  post<ReturnType>({ path, body, queryParams, uriVariables, headers = {} }: PostRequest): Promise<ReturnType> {
    const url = this.createUrl(path, queryParams, uriVariables)
    const startTime = new Date().getTime()
    return this.axiosInstance
      .post<ReturnType>(url, body, {
        headers: this.parseHeaders(headers)
      })
      .then(response => {
        const endTime = new Date().getTime()
        const responseTime = endTime - startTime
        this.logger.log(`Successfully get POST api response ${JSON.stringify({ responseTime, url, headers })}`)
        return response
      })
      .catch(error => {
        this.logger.error(`Failed to get POST API response ${JSON.stringify({ url, headers, error })}`)
        throw error
      }) as Promise<ReturnType>
  }

  put<ReturnType>({ path, body, queryParams, uriVariables, headers = {} }: PostRequest): Promise<ReturnType> {
    const url = this.createUrl(path, queryParams, uriVariables)
    const startTime = new Date().getTime()
    return this.axiosInstance
      .put<ReturnType>(url, body, {
        headers: this.parseHeaders(headers)
      })
      .then(response => {
        const endTime = new Date().getTime()
        const responseTime = endTime - startTime
        this.logger.log(`Successfully get PUT api response ${JSON.stringify({ responseTime, url, headers })}`)
        return response
      })
      .catch(error => {
        this.logger.error(`Failed to get PUT API response ${JSON.stringify({ url, headers, error })}`)
        throw error
      }) as Promise<ReturnType>
  }

  patch<ReturnType>({ path, body, queryParams, uriVariables, headers = {} }: PostRequest): Promise<ReturnType> {
    const url = this.createUrl(path, queryParams, uriVariables)
    const startTime = new Date().getTime()
    return this.axiosInstance
      .patch<ReturnType>(url, body, {
        headers: this.parseHeaders(headers)
      })
      .then(response => {
        const endTime = new Date().getTime()
        const responseTime = endTime - startTime
        this.logger.log(`Successfully get PATCH api response ${JSON.stringify({ responseTime, url, headers })}`)
        return response
      })
      .catch(error => {
        this.logger.error(`Failed to get PATCH API response ${JSON.stringify({ url, headers, error })}`)
        throw error
      }) as Promise<ReturnType>
  }

  delete<ReturnType>({ path, queryParams, uriVariables, headers = {} }: GetRequest): Promise<ReturnType> {
    const url = this.createUrl(path, queryParams, uriVariables)
    const startTime = new Date().getTime()
    return this.axiosInstance
      .delete<ReturnType>(url, {
        headers: this.parseHeaders(headers)
      })
      .then(response => {
        const endTime = new Date().getTime()
        const responseTime = endTime - startTime
        this.logger.log(`Successfully get DELETE api response ${JSON.stringify({ responseTime, url, headers })}`)
        return response
      })
      .catch(error => {
        this.logger.error(`Failed to get DELETE API response ${JSON.stringify({ url, headers, error })}`)
        throw error
      }) as Promise<ReturnType>
  }

  private createUrl(
    path: string,
    queryParams: string | Record<string, string> | string[][] | URLSearchParams = {},
    uriVariables: Record<string, number | string> = {}
  ): string {
    const urlWithPathParams = Object.keys(uriVariables).reduce((url: string, keyName: string) => {
      return url.replace(`{${keyName}}`, uriVariables[keyName] as string)
    }, path)
    const params = new URLSearchParams(queryParams)
    const queryParamsInString = params.toString()

    return urlWithPathParams + (queryParamsInString ? `?${queryParamsInString}` : '')
  }

  private parseHeaders(headers: Document<string>): Document<string> {
    const keysToRemove = ['Content-Length', 'content-length', 'Content-length']
    keysToRemove.forEach(keyToRemove => {
      if (keyToRemove in headers) {
        delete headers[keyToRemove]
      }
    })

    const forwardedHeaders = this.requestContextService.getForwardHeaders()
    return { ...forwardedHeaders, ...headers }
  }
}
