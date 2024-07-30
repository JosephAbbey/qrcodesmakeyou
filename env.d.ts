declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL_URL: string
      DATABASE_URL_URL_NON_POOLING: string
      DATABASE_URL_PRISMA_URL: string
      DATABASE_URL_USER: string
      DATABASE_URL_HOST: string
      DATABASE_URL_PASSWORD: string
      DATABASE_URL_DATABASE: string

      AUTH_SECRET: string

      GITHUB_ID: string
      GITHUB_SECRET: string

      SPOTIFY_ID: string
      SPOTIFY_SECRET: string

      GOOGLE_ID: string
      GOOGLE_SECRET: string
      GOOGLE_KEY: string
    }
  }
}
export {}
