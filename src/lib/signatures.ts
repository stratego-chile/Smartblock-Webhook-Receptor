import { Webhooks } from '@octokit/webhooks'
import { GitHubPayload } from '../helpers/github-payload'

export const verifySignature = async (payload: GitHubPayload, signature: string) => {
  if (!process.env.SECRET) {
    return true
  } else {
    if (
      payload.action !== 'closed' &&
      payload.action !== 'deleted'
    ) {
      return await new Webhooks({
        secret: process.env.SECRET
      }).verify(payload, signature)
    } else {
      return false
    }
  }
}
