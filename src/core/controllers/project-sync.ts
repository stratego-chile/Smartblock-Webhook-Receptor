import { GitHubPayload } from '../../helpers/github-payload'
import fs from 'fs-extra'
import path from 'path'
import { IncomingHttpHeaders } from 'http'
import { verifySignature } from '../../lib/signatures'
import { HTTPError } from '../../lib/http-error'

class ProjectSync {
  public static async handleGitHubEvent (payload: GitHubPayload, headers: IncomingHttpHeaders) {
    const externalSignature = headers['x-hub-signature-256']
    if (!externalSignature) {
      return new HTTPError('Payload signature not provided', 400)
    }
    const isSignatureValid = await verifySignature(payload, externalSignature as string)
    if (!isSignatureValid) {
      return new HTTPError('Payload signature rejection', 403)
    }
    const logsDir = path.resolve(process.cwd(), 'payloads')
    if (!(await fs.pathExists(logsDir))) {
      await fs.mkdirp(logsDir)
    }
    await fs.writeJSON(
      path.resolve(logsDir, `${payload.repository.name}.${Date.now()}.json`), payload
    )
  }
}

export default ProjectSync
