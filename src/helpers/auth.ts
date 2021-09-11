const ALLOWED_TOKENS = [
  'dev_token'
]

export const auth = (token: string): boolean => {
  return ALLOWED_TOKENS.includes(token)
}
