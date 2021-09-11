import { GitHubPayload } from '../../helpers/github-payload'
import fs from 'fs-extra'
import path from 'path'

class ProjectSync {
  public static async handleGitHubEvent (projectMetaData: GitHubPayload): Promise<void> {
    await new Promise<void>(resolve => {
      const logsDir = path.resolve(__dirname, '..', '..', '..', 'logs')
      if (!fs.pathExistsSync(logsDir)) {
        fs.mkdirpSync(logsDir)
      }
      fs.writeJSON(path.resolve(logsDir, `${Date.now()}.log.json`), projectMetaData).then(() => resolve())
    })
  }
}

export default ProjectSync
