export interface IFileList {
  files: IFileInfo[]
}

export interface IFileInfo {
  path: string
  hash: string
  size: number
  mtime: number
}
