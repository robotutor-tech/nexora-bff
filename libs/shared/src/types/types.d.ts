export type Document<T = unknown> = Record<string, T>
export type DocumentArray<T = unknown> = Array<Document<T>>
export type Documents<T = unknown> = Document<T> | DocumentArray<T>
export type Identifier<T> = { id: string; type: T }

export type InputValidationError = {field: string, errors: string[]}

export interface ServerError extends Error {
  errorCode: string
  message: string
  details?: InputValidationError[]
}

export interface ValidationError extends ServerError {
  errors?: Array<{field: string; message: string}>
}

