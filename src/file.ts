import {createHash, Hash} from 'crypto'

export function validateFile(buffer: Buffer, checkSum: string): boolean {
  let hash: Hash
  if (checkSum.length === 32) {
    hash = createHash('md5')
  } else {
    hash = createHash('sha1')
  }
  hash.update(buffer)
  return hash.digest('hex') === checkSum
}
