import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common'
import axios, { AxiosError, AxiosInstance } from 'axios'
import type { GetRequest, PostRequest } from './webclient'
import { Document } from '../types/types'
import { RequestContextService } from '../service/requestContext.service'

@Injectable({ scope: Scope.REQUEST })
export class Webclient {
  private readonly axiosInstance: AxiosInstance

  constructor(private readonly requestContextService: RequestContextService) {
    this.axiosInstance = axios.create({ timeout: 5000 })
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

  get<ReturnType>({ baseUrl, path, queryParams, uriVariables, headers = {} }: GetRequest): Promise<ReturnType> {
    const url = this.createUrl(baseUrl, path, queryParams, uriVariables)
    return this.axiosInstance
      .get<ReturnType>(url, {
        headers: this.parseHeaders(headers)
      })
      .logOnSuccess({
        message: 'Successfully get GET API response',
        additionalData: { baseUrl, path, queryParams, uriVariables, headers },
        skipLoggingArgument: true
      })
      .logOnError({
        errorCode: 'API_FAILURE',
        errorMessage: 'Failed to get GET API response',
        additionalData: { baseUrl, path, queryParams, uriVariables, headers }
      }) as Promise<ReturnType>
  }

  post<ReturnType>({ baseUrl, path, body, queryParams, uriVariables, headers = {} }: PostRequest): Promise<ReturnType> {
    const url = this.createUrl(baseUrl, path, queryParams, uriVariables)
    return this.axiosInstance
      .post<ReturnType>(url, body, {
        headers: this.parseHeaders(headers)
      })
      .logOnSuccess({
        message: 'Successfully get POST API response',
        additionalData: { baseUrl, path, queryParams, uriVariables, headers },
        skipLoggingArgument: true
      })
      .logOnError({
        errorCode: 'API_FAILURE',
        errorMessage: 'Failed to get POST API response',
        additionalData: { baseUrl, path, queryParams, uriVariables, headers }
      }) as Promise<ReturnType>
  }

  put<ReturnType>({ baseUrl, path, body, queryParams, uriVariables, headers = {} }: PostRequest): Promise<ReturnType> {
    const url = this.createUrl(baseUrl, path, queryParams, uriVariables)
    return this.axiosInstance
      .put<ReturnType>(url, body, {
        headers: this.parseHeaders(headers)
      })
      .logOnSuccess({
        message: 'Successfully get PUT API response',
        additionalData: { baseUrl, path, queryParams, uriVariables, headers },
        skipLoggingArgument: true
      })
      .logOnError({
        errorCode: 'API_FAILURE',
        errorMessage: 'Failed to get PUT API response',
        additionalData: { baseUrl, path, queryParams, uriVariables, headers }
      }) as Promise<ReturnType>
  }

  patch<ReturnType>({
    baseUrl,
    path,
    body,
    queryParams,
    uriVariables,
    headers = {}
  }: PostRequest): Promise<ReturnType> {
    const url = this.createUrl(baseUrl, path, queryParams, uriVariables)
    return this.axiosInstance
      .patch<ReturnType>(url, body, {
        headers: this.parseHeaders(headers)
      })
      .logOnSuccess({
        message: 'Successfully get PATCH API response',
        additionalData: { baseUrl, path, queryParams, uriVariables, headers },
        skipLoggingArgument: true
      })
      .logOnError({
        errorCode: 'API_FAILURE',
        errorMessage: 'Failed to get PATCH API response',
        additionalData: { baseUrl, path, queryParams, uriVariables, headers }
      }) as Promise<ReturnType>
  }

  delete<ReturnType>({ baseUrl, path, queryParams, uriVariables, headers = {} }: GetRequest): Promise<ReturnType> {
    const url = this.createUrl(baseUrl, path, queryParams, uriVariables)
    return this.axiosInstance
      .delete<ReturnType>(url, {
        headers: this.parseHeaders(headers)
      })
      .logOnSuccess({
        message: 'Successfully get DELETE API response',
        additionalData: { baseUrl, path, queryParams, uriVariables, headers },
        skipLoggingArgument: true
      })
      .logOnError({
        errorCode: 'API_FAILURE',
        errorMessage: 'Failed to get DELETE API response',
        additionalData: { baseUrl, path, queryParams, uriVariables, headers }
      }) as Promise<ReturnType>
  }

  private createUrl(
    baseUrl: string,
    path: string,
    queryParams: string | Record<string, string> | string[][] | URLSearchParams = {},
    uriVariables: Record<string, number | string> = {}
  ): string {
    const url = baseUrl.concat(path)
    const urlWithPathParams = Object.keys(uriVariables).reduce((url: string, keyName: string) => {
      return url.replace(`{${keyName}}`, uriVariables[keyName] as string)
    }, url)
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

    return { ...this.requestContextService.getForwardHeaders(), ...headers }
  }
}
