'use client'

import { ThemeType } from '@/app/themes/themes'
import { QRCode } from '@/components/qrcode'
import { Skeleton } from '@/components/ui/skeleton'
import qrcode from '@/lib/qrcode'
import Link from 'next/link'
import { Suspense } from 'react'

export function Theme({ theme }: { theme: ThemeType }) {
  return (
    <Link href={`/themes/${theme.id}`}>
      <div className='aspect-square cursor-pointer overflow-hidden rounded-md bg-black'>
        <Suspense fallback={<Skeleton className='h-full w-full' />}>
          <QRCode
            className='transition-opacity hover:opacity-80'
            svg={qrcode(`https://qr.josephabbey.dev/themes/${theme.id}`, theme)}
          />
        </Suspense>
      </div>
    </Link>
  )
}
