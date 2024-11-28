import {ServiceError} from '@bangbang93/service-errors'
import {BeforeErrorHook, HTTPError, RequestError} from 'got'

export const beforeError: BeforeErrorHook[] = [catchServiceError]

export function catchServiceError(error: RequestError): RequestError {
  if (error instanceof HTTPError) {
    if (error.response.headers['content-type']?.includes('application/json')) {
      let body: Record<string, unknown> | undefined
      if (Buffer.isBuffer(error.response.body)) {
        body = JSON.parse(error.response.body.toString('utf-8')) as Record<string, unknown>
      } else if (typeof error.response.body === 'object') {
        body = error.response.body as Record<string, unknown>
      } else if (typeof error.response.body === 'string') {
        body = JSON.parse(error.response.body) as Record<string, unknown>
      }
      if (body && ServiceError.isServiceError(body)) {
        throw ServiceError.fromJSON(body as unknown as Record<string, unknown>)
      }
    }
  }
  return error
}
