// #region API client
export type DefaultRequestHeaders = Record<string, string>

export type APIResponse<T = unknown> = {
  error?: {
    value: boolean
    message: string
    timestamp?: number
  }
  value?: T
}
// #endregion
