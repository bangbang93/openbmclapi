declare module 'http2-express' {
  import express, {Application} from 'express'

  const http2Express: (exp: typeof express) => Application

  export = http2Express
}

declare module 'http2' {
  import type http2 from 'http2'

  function createServer(onRequestHandler?: Application): http2.Http2Server
  function createServer(options: http2.ServerOptions, onRequestHandler?: Application): http2.Http2Server
  function createSecureServer(onRequestHandler?: Application): http2.Http2SecureServer
  function createSecureServer(
    options: http2.SecureServerOptions,
    onRequestHandler?: Application,
  ): http2.Http2SecureServer
}
