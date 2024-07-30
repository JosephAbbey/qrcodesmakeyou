import config from './auth.config'
import prisma from '@/lib/prisma'
import type { TokenSet } from '@auth/core/types'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

const { SPOTIFY_ID, SPOTIFY_SECRET } = process.env

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...config,
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id
      }
      return token // used in session callback
    },
    //       ^---------------v
    async session({ session, token }) {
      session.user.id = token.id as string
      const accounts = await prisma.account.findMany({
        where: { userId: session.user.id },
      })
      for (const account of accounts) {
        switch (account.provider) {
          case 'google':
            if (
              (account.expires_at && account.expires_at * 1000 < Date.now()) ||
              (account.expires_in &&
                account.expires_in * 1000 + account.token_at.getTime() <
                  Date.now())
            ) {
              // If the access token has expired, try to refresh it
              try {
                // https://accounts.google.com/.well-known/openid-configuration
                // We need the `token_endpoint`.
                const response = await fetch(
                  'https://oauth2.googleapis.com/token',
                  {
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                      client_id: process.env.GOOGLE_ID ?? '',
                      client_secret: process.env.GOOGLE_SECRET ?? '',
                      grant_type: 'refresh_token',
                      refresh_token: account.refresh_token ?? '',
                    }),
                    method: 'POST',
                  },
                )

                const tokens: TokenSet = await response.json()

                if (!response.ok) throw tokens

                await prisma.account.update({
                  data: {
                    access_token: tokens.access_token ?? null,
                    expires_at:
                      tokens.expires_at ??
                      Math.floor(Date.now() / 1000 + (tokens.expires_in ?? 0)),
                    expires_in: tokens.expires_in ?? null,
                    refresh_token:
                      tokens.refresh_token ?? account.refresh_token,
                    token_at: new Date(),
                  },
                  where: {
                    provider_providerAccountId: {
                      provider: 'google',
                      providerAccountId: account.providerAccountId,
                    },
                  },
                })
              } catch (error) {
                console.error('Error refreshing access token', error)
                // The error property will be used client-side to handle the refresh token error
                //@ts-expect-error
                session.error = 'RefreshAccessTokenError'
              }
            }
            break
          case 'spotify':
            if (
              (account.expires_at && account.expires_at * 1000 < Date.now()) ||
              (account.expires_in &&
                account.expires_in * 1000 + account.token_at.getTime() <
                  Date.now())
            ) {
              // If the access token has expired, try to refresh it
              try {
                // https://accounts.google.com/.well-known/openid-configuration
                // We need the `token_endpoint`.
                const response = await fetch(
                  'https://accounts.spotify.com/api/token',
                  {
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      Authorization:
                        'Basic ' + btoa(SPOTIFY_ID + ':' + SPOTIFY_SECRET),
                    },
                    body: new URLSearchParams({
                      grant_type: 'refresh_token',
                      refresh_token: account.refresh_token ?? '',
                    }),
                    method: 'POST',
                  },
                )

                const tokens: TokenSet = await response.json()

                if (!response.ok) throw tokens

                await prisma.account.update({
                  data: {
                    access_token: tokens.access_token ?? null,
                    expires_at:
                      tokens.expires_at ??
                      Math.floor(Date.now() / 1000 + (tokens.expires_in ?? 0)),
                    expires_in: tokens.expires_in ?? null,
                    refresh_token:
                      tokens.refresh_token ?? account.refresh_token,
                    token_at: new Date(),
                  },
                  where: {
                    provider_providerAccountId: {
                      provider: 'spotify',
                      providerAccountId: account.providerAccountId,
                    },
                  },
                })
              } catch (error) {
                console.error('Error refreshing access token', error)
                // The error property will be used client-side to handle the refresh token error
                //@ts-expect-error
                session.error = 'RefreshAccessTokenError'
              }
            }
            break
        }
      }
      return session
    },
  },
})
