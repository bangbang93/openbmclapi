import {createHash} from 'crypto'
import {join} from 'path'

/**
 * 将哈希值转换为文件名
 * @param hash - 输入的哈希值
 * @returns 由哈希值前两个字符和原始哈希值组成的文件名
 */
export function hashToFilename(hash: string): string {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  // 提取哈希值的前两个字符
  // 将前缀和原始哈希值连接起来，形成文件名
  return join(hash.substring(0, 2), hash)
}

/**
 * 检查签名是否有效
 * @param hash - 用于生成签名的哈希
 * @param secret - 用于生成签名的秘密
 * @param query - 包含签名和过期时间的对象
 * @returns 如果签名有效且未过期，返回 true；否则，返回 false
 */
export function checkSign(hash: string, secret: string, query: NodeJS.Dict<string>): boolean {
  // 从 query 中解构出签名和过期时间
  const {s, e} = query
  // 如果签名或过期时间不存在，返回 false
  if (!s || !e) return false
  // 创建一个 sha1 哈希
  const sha1 = createHash('sha1')
  // 创建一个包含秘密、哈希和过期时间的数组
  const toSign = [secret, hash, e]
  // 将数组中的每个元素更新到哈希中
  for (const str of toSign) {
    sha1.update(str)
  }
  // 计算哈希的摘要，编码为 'base64url'
  const sign = sha1.digest('base64url')
  // 检查摘要是否等于签名，且当前时间小于过期时间
  return sign === s && Date.now() < parseInt(e, 36)
}
