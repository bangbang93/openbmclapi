import {second} from '@bangbang93/utils'
import {createUpnpClient, UpnpClient} from '@xmcl/nat-api'
import ms from 'ms'
import {logger} from './logger.js'

export async function setupUpnp(port: number, publicPort = port): Promise<string> {
  const client = await createUpnpClient()
  await doPortMap(client, port, publicPort)

  setInterval(() => {
    doPortMap(client, port, publicPort).catch((e) => {
      logger.error(e, 'upnp续期失败')
    })
  }, ms('30m'))

  return await client.externalIp()
}

async function doPortMap(client: UpnpClient, port: number, publicPort: number): Promise<void> {
  await client.map({
    public: publicPort,
    private: port,
    ttl: second('1h'),
    protocol: 'tcp',
    description: 'openbmclapi',
  })
}
