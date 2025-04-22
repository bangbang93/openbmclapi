import {createHash} from 'crypto'
import {join} from 'path'
import rangeParser from 'range-parser'

export function hashToFilename(hash: string): string {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return join(hash.substring(0, 2), hash)
}

export function checkSign(hash: string, secret: string, query: NodeJS.Dict<string>): boolean {
  const {s, e} = query
  if (!s || !e) return false
  const sha1 = createHash('sha1')
  const toSign = [secret, hash, e]
  for (const str of toSign) {
    sha1.update(str)
  }
  const sign = sha1.digest('base64url')
  return sign === s && Date.now() < parseInt(e, 36)
}

export function getSize(size: number, range?: string): number {
  if (!range) return size
  const ranges = rangeParser(size, range, {combine: true})
  if (typeof ranges === 'number') {
    return size
  }
  let total = 0
  for (const range of ranges) {
    total += range.end - range.start + 1
  }
  return total
}
