import { AuthConfig } from '@auth/core/types'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Spotify from 'next-auth/providers/spotify'

const {
  GITHUB_ID,
  GITHUB_SECRET,
  SPOTIFY_ID,
  SPOTIFY_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET,
} = process.env

const config = {
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
    Spotify({ clientId: SPOTIFY_ID, clientSecret: SPOTIFY_SECRET }),
    Google({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          response_type: 'code',
          access_type: 'offline',
          scope:
            'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.readonly',
        },
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
} satisfies AuthConfig

export default config
