import { NextFunction, Request, Response } from 'express'
import ProjectSync from '../../core/controllers/project-sync'
import { auth } from '../../helpers/auth'
import { GitHubPayload } from '../../helpers/github-payload'
import { HTTPError } from '../../helpers/http-error'
import { APIResponse } from '../../types'

class SyncHandler {
  public static syncProject (request: Request<Record<string, string>, any, GitHubPayload>, response: Response, next: NextFunction): void {
    const { authorization = '' } = request.headers
    if (!auth(authorization)) {
      throw new HTTPError('Forbidden access', 403)
    } else {
      ProjectSync.handleGitHubEvent(request.body).then(
        () => response.json({
          value: {
            saved: true,
            timestamp: Date.now()
          }
        } as APIResponse<{ saved: boolean; timestamp: number }>)
      )
    }
  }
}

export default SyncHandler
