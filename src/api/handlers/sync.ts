import { Request, Response } from 'express'
import ProjectSync from '../../core/controllers/project-sync'
import { GitHubPayload } from '../../helpers/github-payload'
import { createErrorResponse } from '../../lib/http-error'
import { APIResponse } from '../../types'

class SyncHandler {
  public static syncProject (request: Request<Record<string, string>, any, GitHubPayload>, response: Response): void {
    ProjectSync.handleGitHubEvent(request.body, request.headers)
      .then(
        (error) => {
          if (error) {
            response
              .status(error.httpCode)
              .json(createErrorResponse(error))
          } else {
            response.json({
              value: {
                synced: true,
                timestamp: Date.now()
              }
            } as APIResponse<{ synced: boolean; timestamp: number }>)
          }
        }
      )
  }
}

export default SyncHandler
