export const GITHUB_HEADERS = [
  'X-GitHub-Event',
  'X-GitHub-Delivery',
  'X-Hub-Signature',
  'X-Hub-Signature-256'
]

export type GitHubPayload = {
  action: 'created' | 'edited' | 'deleted' | 'closed'
  rule: Record<string, any>
  changes: Record<string, any>
  repository: Record<string, any>
  organization: Record<string, any>
  sender: Record<string, any>
} & Record<string, any>
