import * as Agent from 'elastic-apm-node'

export function setupApm(): void {
  Agent.start()
}
