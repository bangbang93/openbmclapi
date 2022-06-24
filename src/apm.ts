import {start} from 'elastic-apm-node'

export function setupApm(): void {
  start()
}
