declare namespace NodeJS {
  export interface ProcessEnv {
    DISABLE_SENTRY: string;
    TODAY_TIX_API_BASE_URL: string;
    TODAY_TIX_API_OAUTH_ENDPOINT: string;
    TODAY_TIX_API_V2_ENDPOINT: string;
    TODAY_TIX_APP_URL: string;
  }
}
