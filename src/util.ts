import {join} from 'path'

export function hashToFilename(hash: string): string {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return join(hash.substring(0, 2), hash)
}
