'use client'

import { SetUrlContext } from './qrcode-section'
import type { QuickType } from '@/app/quicks'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import {
  SiYoutube,
  SiYoutubemusic,
  SiGithub,
  SiSpotify,
} from '@icons-pack/react-simple-icons'
import { use } from 'react'

export function Quick({ quick }: { quick: QuickType }) {
  const setUrl = use(SetUrlContext)

  return (
    <Card
      className='cursor-pointer transition-colors hover:bg-secondary'
      onClick={() => setUrl && setUrl(quick.url)}
    >
      <CardHeader className='flex h-full flex-row items-center gap-4 space-y-0'>
        {quick.img ?
          <div
            className='aspect-square w-20 min-w-20 overflow-hidden rounded-md bg-cover bg-center bg-no-repeat'
            style={{
              backgroundImage: `url(${quick.img})`,
            }}
          ></div>
        : <div className='aspect-square w-20 min-w-20 overflow-hidden rounded-md bg-secondary'>
            {quick.provider == 'yt' ?
              <SiYoutube className='h-full w-full p-4' />
            : quick.provider == 'yt mu' ?
              <SiYoutubemusic className='h-full w-full p-4' />
            : quick.provider == 'gh' ?
              <SiGithub className='h-full w-full p-4' />
            : quick.provider == 'sp' ?
              <SiSpotify className='h-full w-full p-4' />
            : null}
          </div>
        }
        <CardTitle className='truncate overflow-ellipsis text-pretty align-middle'>
          {quick.title}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
