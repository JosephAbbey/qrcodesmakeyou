import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import Spotify from '@auth/core/providers/spotify';
import Google from '@auth/core/providers/google';
import {
  GITHUB_ID,
  GITHUB_SECRET,
  SPOTIFY_ID,
  SPOTIFY_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET
} from '$env/static/private';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '$lib/prisma';
import type { TokenSet } from './$types';

import { prepareStylesSSR } from '@svelteuidev/core';

export const handle: Handle = sequence(
  SvelteKitAuth({
    adapter: PrismaAdapter(prisma),
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
              'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.readonly'
          }
        }
      })
    ],
    callbacks: {
      async session({ session, user }) {
        const accounts = await prisma.account.findMany({
          where: { userId: user.id }
        });
        for (const account of accounts) {
          switch (account.provider) {
            case 'google':
              if (
                (account.expires_at && account.expires_at * 1000 < Date.now()) ||
                (account.expires_in &&
                  account.expires_in * 1000 + account.token_at.getTime() < Date.now())
              ) {
                // If the access token has expired, try to refresh it
                try {
                  // https://accounts.google.com/.well-known/openid-configuration
                  // We need the `token_endpoint`.
                  const response = await fetch('https://oauth2.googleapis.com/token', {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                      client_id: process.env.GOOGLE_ID ?? '',
                      client_secret: process.env.GOOGLE_SECRET ?? '',
                      grant_type: 'refresh_token',
                      refresh_token: account.refresh_token ?? ''
                    }),
                    method: 'POST'
                  });

                  const tokens: TokenSet = await response.json();

                  if (!response.ok) throw tokens;

                  await prisma.account.update({
                    data: {
                      access_token: tokens.access_token,
                      expires_at:
                        tokens.expires_at ??
                        Math.floor(Date.now() / 1000 + (tokens.expires_in ?? 0)),
                      expires_in: tokens.expires_in,
                      refresh_token: tokens.refresh_token ?? account.refresh_token,
                      token_at: new Date()
                    },
                    where: {
                      provider_providerAccountId: {
                        provider: 'google',
                        providerAccountId: account.providerAccountId
                      }
                    }
                  });
                } catch (error) {
                  console.error('Error refreshing access token', error);
                  // The error property will be used client-side to handle the refresh token error
                  session.error = 'RefreshAccessTokenError';
                }
              }
              break;
            case 'spotify':
              if (
                (account.expires_at && account.expires_at * 1000 < Date.now()) ||
                (account.expires_in &&
                  account.expires_in * 1000 + account.token_at.getTime() < Date.now())
              ) {
                // If the access token has expired, try to refresh it
                try {
                  // https://accounts.google.com/.well-known/openid-configuration
                  // We need the `token_endpoint`.
                  const response = await fetch('https://accounts.spotify.com/api/token', {
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      Authorization: 'Basic ' + btoa(SPOTIFY_ID + ':' + SPOTIFY_SECRET)
                    },
                    body: new URLSearchParams({
                      grant_type: 'refresh_token',
                      refresh_token: account.refresh_token ?? ''
                    }),
                    method: 'POST'
                  });

                  const tokens: TokenSet = await response.json();

                  if (!response.ok) throw tokens;

                  await prisma.account.update({
                    data: {
                      access_token: tokens.access_token,
                      expires_at:
                        tokens.expires_at ??
                        Math.floor(Date.now() / 1000 + (tokens.expires_in ?? 0)),
                      expires_in: tokens.expires_in,
                      refresh_token: tokens.refresh_token ?? account.refresh_token,
                      token_at: new Date()
                    },
                    where: {
                      provider_providerAccountId: {
                        provider: 'spotify',
                        providerAccountId: account.providerAccountId
                      }
                    }
                  });
                } catch (error) {
                  console.error('Error refreshing access token', error);
                  // The error property will be used client-side to handle the refresh token error
                  session.error = 'RefreshAccessTokenError';
                }
              }
              break;
          }
        }
        session.user.id = user.id;
        return session;
      }
    }
  }),
  prepareStylesSSR
);
