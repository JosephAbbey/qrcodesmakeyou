import { ThemeType } from './themes/themes'
import { Quick } from '@/app/quick'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { type } from 'arktype'
import { User } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import 'server-only'

const { GOOGLE_KEY } = process.env

export interface QuickType {
  url: string
  img?: string | undefined
  title: string
  provider: 'yt' | 'yt mu' | 'gh' | 'sp'
  updated_at: number
}

const YoutubePlaylists = type({
  kind: '"youtube#playlistListResponse"',
  items: [
    {
      kind: '"youtube#playlist"',
      id: 'string',
      snippet: {
        publishedAt: 'parse.date',
        title: 'string',
        thumbnails: {
          '[string]': {
            url: 'string',
            width: 'integer',
            height: 'integer',
          },
        },
      },
      'status?': {
        privacyStatus: '"private" | "public" | "unlisted"',
      },
    },
    '[]',
  ],
})

const GithubRepos = type([
  {
    id: 'integer',
    name: 'string',
    private: 'boolean',
    html_url: 'url',
    created_at: 'parse.date | null',
    updated_at: 'parse.date | null',
    //...
  },
  '[]',
])

const SpotifyPlaylists = type({
  items: [
    {
      external_urls: {
        spotify: 'url',
      },
      id: 'string',
      images: [
        {
          url: 'url',
          height: 'integer | null',
          width: 'integer | null',
        },
        '[]',
      ],
      name: 'string',
      public: 'boolean',
    },
    '[]',
  ],
})

const items = 10

async function getQuicks(user: User) {
  const accounts = await prisma.account.findMany({
    where: { userId: user.id! },
  })

  const promises: Promise<QuickType[]>[] = []
  for (const account of accounts) {
    switch (account.provider) {
      case 'google':
        promises.push(
          fetch(
            `https://youtube.googleapis.com/youtube/v3/playlists?part=id&part=snippet&maxResults=${items}&mine=true&key=${GOOGLE_KEY}`,
            {
              headers: {
                Authorization: 'Bearer ' + account.access_token,
                Accept: 'application/json',
              },
            },
          )
            .then((r) => r.json())
            .then((r) => YoutubePlaylists(r))
            .then((d) =>
              d instanceof type.errors ?
                []
              : d.items.flatMap((i) =>
                  i.status?.privacyStatus == 'private' ?
                    []
                  : [
                      {
                        url: 'https://www.youtube.com/playlist?list=' + i.id,
                        img: i.snippet.thumbnails.standard.url,
                        title: i.snippet.title,
                        updated_at: i.snippet.publishedAt.getTime(),
                        provider: 'yt',
                      },
                      {
                        url: 'https://music.youtube.com/playlist?list=' + i.id,
                        img: i.snippet.thumbnails.standard.url,
                        title: i.snippet.title,
                        updated_at: i.snippet.publishedAt.getTime(),
                        provider: 'yt mu',
                      },
                    ],
                ),
            ),
        )
        break
      case 'github':
        promises.push(
          fetch(
            `https://api.github.com/user/repos?per_page=${items}&sort=updated`,
            {
              headers: {
                Authorization: 'Bearer ' + account.access_token,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
              },
            },
          )
            .then((r) => r.json())
            .then((r) => GithubRepos(r))
            .then((d) =>
              d instanceof type.errors ?
                []
              : d
                  .filter((i) => !i.private)
                  .map((i) => ({
                    url: i.html_url,
                    title: i.name,
                    updated_at: i.updated_at?.getTime() ?? 0,
                    provider: 'gh',
                  })),
            ),
        )
        break
      case 'spotify':
        promises.push(
          fetch(
            `https://api.spotify.com/v1/me/playlists?limit=${items}&offset=0`,
            {
              headers: {
                Authorization: 'Bearer ' + account.access_token,
              },
            },
          )
            .then((r) => r.json())
            .then((r) => SpotifyPlaylists(r))
            .then((d) =>
              d instanceof type.errors ?
                []
              : d.items
                  .filter((i) => i.public)
                  .map((i) => ({
                    url: i.external_urls.spotify,
                    img: i.images[0]?.url,
                    title: i.name,
                    updated_at: 0,
                    provider: 'sp',
                  })),
            ),
        )
        break
    }
  }

  return Promise.allSettled(promises).then((results) =>
    results
      .filter((q) => q.status == 'fulfilled')
      .map((q) => q.value)
      .flat(),
  )
}

export async function Quicks() {
  const session = await auth()

  if (session == null || !session.user) {
    return (
      <div>
        You need to setup{' '}
        <Link href='/accounts' className='text-accent-foreground underline'>
          accounts
        </Link>{' '}
        to use this feature.
      </div>
    )
  }

  const quicks = await getQuicks(session.user)

  return (
    <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
      {quicks
        // Sort by updated_at DESC
        .toSorted((a, b) => b.updated_at - a.updated_at)
        .map((quick, i) => (
          <Quick key={i} quick={quick} />
        ))}
    </div>
  )
}
