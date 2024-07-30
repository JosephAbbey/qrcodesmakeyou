'use client'

import { ThemeContext } from '@/app/qrcode-section'
import { ThemeType } from '@/app/themes/themes'
import { QRCode } from '@/components/qrcode'
import { Skeleton } from '@/components/ui/skeleton'
import qrcode from '@/lib/qrcode'
import { cn } from '@/lib/utils'
import { Suspense, use } from 'react'

export function Theme({ theme }: { theme: ThemeType | null }) {
  const themeState = use(ThemeContext)
  const selectedTheme = themeState?.theme
  const setSelectedTheme = themeState?.setTheme

  return (
    <div
      className={cn(
        'aspect-square cursor-pointer overflow-hidden rounded-md bg-black',
        {
          'ring-4 ring-blue-600': theme?.id === selectedTheme?.id,
        },
      )}
      onClick={() => setSelectedTheme && setSelectedTheme(theme)}
    >
      <Suspense fallback={<Skeleton className='h-full w-full' />}>
        <QRCode
          className='transition-opacity hover:opacity-80'
          svg={qrcode(
            theme == null ?
              'https://qr.josephabbey.dev'
            : `https://qr.josephabbey.dev/themes/${theme.id}`,
            theme,
          )}
        />
      </Suspense>
    </div>
  )
}
