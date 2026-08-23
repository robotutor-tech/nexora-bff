import type { Document } from '@shared/types/types'

export type GetRequest = {
  path: string
  queryParams?: string | Record<string, string> | string[][] | URLSearchParams
  uriVariables?: Record<string, number | string>
  headers?: Record<string, string>
  skipLoggingResponseBody?: boolean
}

export type PostRequest<T extends Document = Document> = GetRequest & {
  body?: T
  skipLoggingRequestBody?: boolean
}

export type WebClientRequest<T extends Document = Document> = PostRequest<T> & {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
}
