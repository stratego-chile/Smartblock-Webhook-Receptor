declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'production' | 'development' | 'test'
      PORT?: string
      RUN_MODE?: 'auto' | 'module'
      BUILD_MODE?: 'yes' | 'no'
      USE_SSL?: 'yes' | 'no'
      SSL_CERT?: string
      SSL_KEY?: string
      SAVE_LOGS?: 'yes' | 'no'
      BASE_PATH?: string
      SECRET?: string
    }
  }
}

export { }
