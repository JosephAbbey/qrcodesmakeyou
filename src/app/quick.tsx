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
import { UserCircle2 } from 'lucide-react'
import { use } from 'react'

export function Quick({ quick }: { quick: QuickType }) {
  const setUrl = use(SetUrlContext)

  return (
    <Card
      className='cursor-pointer transition-colors hover:bg-secondary'
      onClick={() => setUrl && setUrl(quick.url)}
    >
      <CardHeader className='flex h-full flex-row items-center gap-4 space-y-0'>
        <div
          className='aspect-square w-20 min-w-20 overflow-hidden rounded-md bg-secondary bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: `url(${quick.img})`,
          }}
        >
          <div className='flex h-full w-full content-center justify-center gap-2 bg-black bg-opacity-25 p-4 text-white'>
            {quick.provider == 'youtube' ?
              <SiYoutube className='h-full w-full' />
            : quick.provider == 'youtube music' ?
              <SiYoutubemusic className='h-full w-full' />
            : quick.provider == 'github' ?
              <SiGithub className='h-full w-full' />
            : quick.provider == 'spotify' ?
              <SiSpotify className='h-full w-full' />
            : null}
            {quick.account && <UserCircle2 className='h-full w-full' />}
          </div>
        </div>
        <CardTitle
          title={quick.title}
          className='truncate overflow-ellipsis text-pretty align-middle'
        >
          {quick.title}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
