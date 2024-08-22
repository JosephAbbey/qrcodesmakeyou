import config from '@/lib/auth.config'
import prisma from '@/lib/prisma'
import type { TokenSet } from '@auth/core/types'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { type } from 'arktype'
import NextAuth, { type Profile } from 'next-auth'

const { SPOTIFY_ID, SPOTIFY_SECRET, GOOGLE_KEY } = process.env

declare module 'next-auth' {
  interface Profile {
    display_name?: string
    login?: string
    external_urls?: {
      spotify?: string
    }
    html_url?: string
  }
}

const YoutubeChannel = type({
  kind: '"youtube#channel"',
  id: 'string',
  snippet: {
    title: 'string',
    customUrl: 'string',
  },
})

const YoutubeChannels = type({
  kind: '"youtube#channelListResponse"',
  items: [YoutubeChannel, '[]'],
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...config,
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id
      }

      console.log(arguments[0])

      if (account) {
        let username: string | null = null
        let url: string | null = null
        if (account.provider === 'google') {
          const res = await fetch(
            `https://youtube.googleapis.com/youtube/v3/channels?part=id&part=snippet&maxResults=1&mine=true&key=${GOOGLE_KEY}`,
            {
              headers: {
                Authorization: 'Bearer ' + account.access_token,
                Accept: 'application/json',
              },
            },
          )
          const d = await res.json()
          console.log(d.items[0])
          const data = YoutubeChannels(d)
          if (data instanceof type.errors) {
            console.error(data)
          } else {
            username = data.items[0].snippet.title
            url = `https://www.youtube.com/${data.items[0].snippet.customUrl ?? data.items[0].id}`
          }
        }
        await prisma.account.upsert({
          create: {
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            id_token: account.id_token,
            scope: account.scope,
            user: {
              connectOrCreate:
                user.id ?
                  {
                    create: {
                      email: user.email,
                      name: user.name,
                      id: user.id,
                      image: user.image,
                    },
                    where: {
                      id: user.id,
                    },
                  }
                : undefined,
              create:
                user.id ? undefined : (
                  {
                    email: user.email,
                    name: user.name,
                    id: user.id,
                    image: user.image,
                  }
                ),
            },
            token_type: account.token_type,
            access_token: account.access_token ?? null,
            expires_at:
              account.expires_at ??
              Math.floor(Date.now() / 1000 + (account.expires_in ?? 0)),
            expires_in: account.expires_in ?? null,
            refresh_token: account.refresh_token,
            token_at: new Date(),
            error: false,
            username:
              username ??
              profile?.preferred_username ??
              profile?.display_name ??
              profile?.nickname ??
              profile?.login ??
              profile?.name,
            email: profile?.email,
            url: url ?? profile?.external_urls?.spotify ?? profile?.html_url,
          },
          update: {
            access_token: account.access_token ?? null,
            expires_at:
              account.expires_at ??
              Math.floor(Date.now() / 1000 + (account.expires_in ?? 0)),
            expires_in: account.expires_in ?? null,
            refresh_token: account.refresh_token,
            token_at: new Date(),
            error: false,
            username:
              username ??
              profile?.preferred_username ??
              profile?.display_name ??
              profile?.nickname ??
              profile?.login ??
              profile?.name,
            email: profile?.email,
            url: url ?? profile?.external_urls?.spotify ?? profile?.html_url,
          },
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        })
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
        if (account.error) continue
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
                    error: false,
                  },
                  where: {
                    provider_providerAccountId: {
                      provider: 'spotify',
                      providerAccountId: account.providerAccountId,
                    },
                  },
                })
              } catch (error) {
                await prisma.account.update({
                  data: {
                    error: true,
                  },
                  where: {
                    provider_providerAccountId: {
                      provider: 'spotify',
                      providerAccountId: account.providerAccountId,
                    },
                  },
                })
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
