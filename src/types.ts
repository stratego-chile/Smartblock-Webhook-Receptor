// #region API client
export type DefaultRequestHeaders = Record<string, string>

export type APIResponse<T = unknown> = {
  error?: never
  value?: T
} | {
  error: {
    value: boolean
    message: string
    timestamp?: number
  }
  value?: null | never
}
// #endregion

// #region Application config
export type MorganLoggerMode =
  | 'combined'
  | 'common'
  | 'dev'
  | 'short'
  | 'tiny'
// #endregion
