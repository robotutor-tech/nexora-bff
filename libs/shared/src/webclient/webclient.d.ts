export type GetRequest = {
  baseUrl: string
  path: string
  queryParams?: string | Record<string, string> | string[][] | URLSearchParams
  uriVariables?: Record<string, number | string>
  headers?: Record<string, string>
  skipLoggingResponseBody?: boolean
}

export type PostRequest<T extends Record<string, unknown> = Record<string, unknown>> = GetRequest & {
  body?: T
  skipLoggingRequestBody?: boolean
}
