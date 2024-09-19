import {ServiceError} from '@bangbang93/service-errors'
import {BeforeErrorHook, HTTPError, RequestError} from 'got'

export const beforeError: BeforeErrorHook[] = [catchServiceError]

export function catchServiceError(error: RequestError): RequestError {
  if (error instanceof HTTPError) {
    if (error.response.headers['content-type']?.includes('application/json')) {
      const body = JSON.parse(error.response.body.toString())
      if (ServiceError.isServiceError(body)) {
        throw ServiceError.fromJSON(body as unknown as Record<string, unknown>)
      }
    }
  }
  return error
}
