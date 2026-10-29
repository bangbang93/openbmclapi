import {describe, expect, it} from 'vitest'
import {validateFile} from '../src/file.js'

describe('validateFile', () => {
  it.each([
    ['5d41402abc4b2a76b9719d911017c592', '32 位校验和按 md5 校验'],
    ['aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d', '非 32 位校验和按 sha1 校验'],
  ])('%s: %s', (checkSum) => {
    expect(validateFile(Buffer.from('hello'), checkSum)).toBe(true)
  })

  it('校验和不匹配时返回 false', () => {
    expect(validateFile(Buffer.from('hello'), 'ffffffffffffffffffffffffffffffff')).toBe(false)
    expect(validateFile(Buffer.from('hello'), 'ffffffffffffffffffffffffffffffffffffffff')).toBe(false)
  })
})
