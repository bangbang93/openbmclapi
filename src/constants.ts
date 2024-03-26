import avsc from 'avsc'

export const FileListSchema = avsc.Type.forSchema({
  type: 'array',
  items: {
    name: 'FileListEntry',
    type: 'record',
    fields: [
      {name: 'path', type: 'string'},
      {name: 'hash', type: 'string'},
      {name: 'size', type: 'long'},
      {name: 'mtime', type: 'long'},
    ],
  },
})
