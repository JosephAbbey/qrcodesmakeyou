'use client'

import { ThemeType } from '../../themes'
import { save } from './actions'
import { QRCode } from '@/components/qrcode'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import qrcode from '@/lib/qrcode'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Save } from 'lucide-react'
import { Suspense, useTransition, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

export function ThemeInnerClient({
  theme,
}: Readonly<{
  theme: ThemeType
}>) {
  const [_, startTransition] = useTransition()

  const [light, setLight] = useState(theme.light ?? '#ffffff')
  const [dark, setDark] = useState(theme.dark ?? '#000000')
  const [cornersPath, setCornersPath] = useState(theme.corners_path ?? '')
  const [cornersFill, setCornersFill] = useState(
    theme.corners_fill ?? '#000000',
  )
  const [rounded, setRounded] = useState(theme.rounded ?? false)

  return (
    <>
      <div className='aspect-square w-full max-w-80 overflow-hidden rounded-xl'>
        <Suspense fallback={<Skeleton className='h-full w-full' />}>
          <QRCode
            svg={qrcode(`https://qr.josephabbey.dev/themes/${theme.id}`, {
              light,
              dark,
              corners_path: cornersPath,
              corners_fill: cornersFill,
              rounded,
            })}
          />
        </Suspense>
      </div>

      <form
        action={() => {
          save(theme.id, {
            light,
            dark,
            corners_path: cornersPath,
            corners_fill: cornersFill,
            rounded,
          })
        }}
        className='grid w-full max-w-2xl gap-2'
      >
        {/* TODO: Use proper colour pickers */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='flex gap-2 px-2'>
              <div
                className='aspect-square h-full rounded-sm'
                style={{
                  backgroundColor: light,
                }}
              />
              <span className='flex-grow'>Light Colour</span>
              <div className='aspect-square h-full' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='aspect-square p-6'>
            <HexColorPicker
              // Can't use tailwind due to specificity
              style={{
                width: '100%',
                height: '100%',
              }}
              color={light}
              onChange={(v) => startTransition(() => setLight(v))}
              id='light'
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='flex gap-2 px-2'>
              <div
                className='aspect-square h-full rounded-sm'
                style={{
                  backgroundColor: dark,
                }}
              />
              <span className='flex-grow'>Dark Colour</span>
              <div className='aspect-square h-full' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='aspect-square p-6'>
            <HexColorPicker
              // Can't use tailwind due to specificity
              style={{
                width: '100%',
                height: '100%',
              }}
              color={dark}
              onChange={(v) => startTransition(() => setDark(v))}
              id='dark'
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='flex gap-2 px-2'>
              <div
                className='aspect-square h-full rounded-sm'
                style={{
                  backgroundColor: cornersFill,
                }}
              />
              <span className='flex-grow'>Corner Fill Colour</span>
              <div className='aspect-square h-full' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='aspect-square p-6'>
            <HexColorPicker
              // Can't use tailwind due to specificity
              style={{
                width: '100%',
                height: '100%',
              }}
              color={cornersFill}
              onChange={(v) => startTransition(() => setCornersFill(v))}
              id='corners_fill'
            />
          </PopoverContent>
        </Popover>
        <Textarea
          // defaultValue={theme.corners_path ?? ''}
          value={cornersPath}
          onChange={(e) =>
            startTransition(() => setCornersPath(e.target.value))
          }
          placeholder='Corner Path'
          name='corners_path'
          id='corners_path'
        />
        <div className='mx-2 mt-2 flex items-center space-x-2'>
          <Checkbox
            id='rounded'
            name='rounded'
            checked={rounded}
            onCheckedChange={(e: CheckedState) =>
              startTransition(() => setRounded(e as boolean))
            }
          />
          <Label htmlFor='rounded'>Rounded</Label>
        </div>
        <Button type='submit' className='flex gap-2'>
          <Save />
          Save
        </Button>
      </form>
    </>
  )
}
