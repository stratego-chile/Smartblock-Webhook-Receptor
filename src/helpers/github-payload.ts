export const GITHUB_HEADERS = [
  'X-GitHub-Event',
  'X-GitHub-Delivery',
  'X-Hub-Signature',
  'X-Hub-Signature-256'
]

export type GitHubPayload = {
  action: 'created' | 'edited' | 'deleted'
  rule: Record<string, unknown>
  changes: Record<string, unknown>
  repository: Record<string, unknown>
  organization: Record<string, unknown>
  sender: Record<string, unknown>
}
