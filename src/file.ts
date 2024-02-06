import {createHash, Hash} from 'crypto'

/**
 * 验证文件的完整性
 * @param buffer - 文件的内容
 * @param checkSum - 文件的校验和
 * @returns 如果文件的哈希值等于校验和，返回 true；否则，返回 false
 */
export function validateFile(buffer: Buffer, checkSum: string): boolean {
  let hash: Hash
  // 如果校验和的长度为 32，创建一个 md5 哈希；否则，创建一个 sha1 哈希
  if (checkSum.length === 32) {
    hash = createHash('md5')
  } else {
    hash = createHash('sha1')
  }
  // 使用文件的内容更新哈希
  hash.update(buffer)
  // 计算哈希的摘要（以十六进制表示），并检查摘要是否等于校验和
  return hash.digest('hex') === checkSum
}