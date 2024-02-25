import got, {type Got} from 'got'
import ms from 'ms'
import {createHmac} from 'node:crypto'
import {logger} from './logger.js'

export class TokenManager {
  private token: string | undefined
  private readonly got: Got

  private readonly prefixUrl = process.env.CLUSTER_BMCLAPI ?? 'https://openbmclapi.bangbang93.com'

  constructor(
    private readonly clusterId: string,
    private readonly clusterSecret: string,
    version: string,
  ) {
    this.got = got.extend({
      prefixUrl: this.prefixUrl,
      headers: {
        'user-agent': `openbmclapi-cluster/${version}`,
      },
      timeout: {
        request: ms('5m'),
      },
    })
  }

  public async getToken(): Promise<string> {
    if (!this.token) {
      this.token = await this.fetchToken()
    }
    return this.token
  }

  private async fetchToken(): Promise<string> {
    const challenge = await this.got
      .get('openbmclapi-agent/challenge', {
        searchParams: {
          clusterId: this.clusterId,
        },
      })
      .json<{challenge: string}>()
    const signature = createHmac('sha256', this.clusterSecret).update(challenge.challenge).digest('hex')
    const token = await this.got
      .post('openbmclapi-agent/token', {
        json: {
          clusterId: this.clusterId,
          challenge: challenge.challenge,
          signature,
        },
      })
      .json<{token: string; ttl: number}>()
    setTimeout(
      () => {
        this.refreshToken().catch((err) => {
          logger.error(err, 'refresh token error')
        })
      },
      token.ttl - ms('10m'),
    )
    return token.token
  }

  private async refreshToken(): Promise<void> {
    this.token = await this.fetchToken()
  }
}
