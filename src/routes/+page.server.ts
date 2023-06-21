import type { PageServerLoad } from './$types';
import { GOOGLE_KEY } from '$env/static/private';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.getSession();
  const accounts = await prisma.account.findMany({
    where: { userId: session?.user?.id ?? '' }
  });

  interface QuickGen {
    url: string;
    img?: string | undefined;
    title: string;
    provider: 'yt' | 'yt mu' | 'gh' | 'sp';
    updated_at: number;
  }

  const promises: Promise<QuickGen[]>[] = [];
  for (const account of accounts) {
    switch (account.provider) {
      // case 'spotify':
      //   fetch('https://api.spotify.com/v1/me/playlists', {
      //     headers: { Authentication: 'Bearer ' + account.access_token }
      //   });
      //   break;
      case 'google':
        promises.push(
          fetch(
            'https://youtube.googleapis.com/youtube/v3/playlists?part=id&part=snippet&maxResults=5&mine=true&key=' +
              GOOGLE_KEY,
            {
              headers: {
                Authorization: 'Bearer ' + account.access_token,
                Accept: 'application/json'
              }
            }
          )
            .then((r) => r.json())
            .then(
              (d) =>
                d.items?.flatMap((i: any) => [
                  {
                    url: 'https://www.youtube.com/playlist?list=' + i.id,
                    img: i.snippet.thumbnails.default.url,
                    title: i.snippet.localized.title,
                    updated_at: i.snippet.publishedAt,
                    provider: 'yt'
                  },
                  {
                    url: 'https://music.youtube.com/playlist?list=' + i.id,
                    img: i.snippet.thumbnails.default.url,
                    title: i.snippet.localized.title,
                    updated_at: i.snippet.publishedAt,
                    provider: 'yt mu'
                  }
                ]) ?? []
            )
        );
        break;
      case 'github':
        promises.push(
          fetch('https://api.github.com/user', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + account.access_token,
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
            .then((u) => u.json())
            .then((u) =>
              fetch(
                u.repos_url +
                  '?' +
                  new URLSearchParams({
                    per_page: '5',
                    sort: 'updated'
                  }),
                {
                  headers: {
                    Authorization: 'Bearer ' + account.access_token,
                    Accept: 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                  }
                }
              )
                .then((r) => r.json())
                .then(
                  (d) =>
                    d?.map((i: any) => ({
                      url: i.html_url,
                      title: i.name,
                      updated_at: i.updated_at,
                      provider: 'gh'
                    })) ?? []
                )
            )
        );
        break;
      case 'spotify':
        promises.push(
          fetch('https://api.spotify.com/v1/me/playlists?limit=5&offset=0', {
            headers: {
              Authorization: 'Bearer ' + account.access_token
            }
          })
            .then((r) => r.json())
            .then(
              (d) =>
                d?.items?.map((i: any) => ({
                  url: i.external_urls.spotify,
                  img: i.images[0]?.url,
                  title: i.name,
                  updated_at: 0,
                  provider: 'sp'
                })) ?? []
            )
        );
        break;
    }
  }

  const themes =
    (
      await prisma.user.findUnique({
        where: { id: session?.user?.id ?? '' },
        include: {
          themes: true
        }
      })
    )?.themes ?? [];

  return {
    quick_gens: Promise.all(promises).then((d) =>
      d.flat().sort((a, b) => {
        const keyA = new Date(a.updated_at),
          keyB = new Date(b.updated_at);
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      })
    ),
    themes
  };
};
