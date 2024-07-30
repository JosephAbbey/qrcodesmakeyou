'use client'

import { ThemeType } from '../themes'
import { forget, add } from './actions'
import { QRCode } from '@/components/qrcode'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import qrcode from '@/lib/qrcode'
import {
  DivideSquareIcon,
  Edit,
  PlusCircle,
  Share2,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useOptimistic, Suspense } from 'react'
import { toast } from 'sonner'

export function ThemeInnerClient({
  theme,
  added,
}: Readonly<{
  theme: ThemeType
  added: boolean
}>) {
  const [addedState, setAddedState] = useState(added)
  const [optimisticAdded, addOptimisticAdded] = useOptimistic<
    boolean,
    'add' | 'forget'
  >(addedState, (state, action) => {
    switch (action) {
      case 'add':
        return true
      case 'forget':
        return false
    }
  })

  return (
    <>
      <div className='aspect-square w-full max-w-80 overflow-hidden rounded-xl'>
        <Suspense fallback={<Skeleton className='h-full w-full' />}>
          <QRCode
            svg={qrcode(`https://qr.josephabbey.dev/themes/${theme.id}`, theme)}
          />
        </Suspense>
      </div>
      <div className='flex flex-wrap justify-center gap-2'>
        <Button
          type='button'
          className='flex gap-2'
          onClick={() => {
            navigator.share({
              url: `https://qr.josephabbey.dev/themes/${theme.id}`,
            })
          }}
        >
          <Share2 />
          Share
        </Button>
        {optimisticAdded ?
          <>
            <Link href={`/themes/${theme.id}/edit`}>
              <Button type='button' className='flex gap-2'>
                <Edit />
                Edit
              </Button>
            </Link>
            <Button
              type='button'
              className='flex gap-2'
              onClick={async () => {
                addOptimisticAdded('forget')
                setAddedState(await forget(theme.id))
              }}
            >
              <Trash2 />
              Forget
            </Button>
          </>
        : <Button
            type='submit'
            className='flex gap-2'
            onClick={async () => {
              addOptimisticAdded('add')
              setAddedState(await add(theme.id))
            }}
          >
            <PlusCircle />
            Add
          </Button>
        }
      </div>
      <ScrollArea
        onClick={async () => {
          await navigator.clipboard.writeText(
            `https://qr.josephabbey.dev/themes/${theme.id}`,
          )
          toast('Copied to clipboard')
        }}
        className='w-full max-w-2xl cursor-pointer select-none rounded-md bg-secondary p-2 font-mono'
      >
        {`https://qr.josephabbey.dev/themes/${theme.id}`}
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </>
  )
}
