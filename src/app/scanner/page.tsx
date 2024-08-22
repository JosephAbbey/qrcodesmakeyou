'use client'

import { ThemeInnerClient } from '../themes/[id]/client'
import { getTheme } from './actions'
import { Nav } from '@/components/nav'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsDesktop } from '@/hooks/use-media-query'
import { Flashlight, FlashlightOff } from 'lucide-react'
import Link from 'next/link'
import { startTransition, Suspense, use, useEffect, useState } from 'react'
import {
  BarcodeScanner,
  type DetectedBarcode,
  useTorch,
} from 'react-barcode-scanner'
import 'react-barcode-scanner/polyfill'

function ThemeDialogContent({ data }: { data: ReturnType<typeof getTheme> }) {
  const { theme, added } = use(data)

  return <ThemeInnerClient theme={theme} added={added} />
}

function ThemeDialog({
  id,
  open,
  setOpen,
}: {
  id: string
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const data = getTheme(id)
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle className='hidden'>Theme Preview</DialogTitle>
          <div className='m-4 mt-10 flex flex-col items-center gap-16 overflow-hidden'>
            <Suspense
              fallback={
                <>
                  <div className='aspect-square w-full max-w-80 overflow-hidden rounded-xl'>
                    <Skeleton className='h-full w-full' />
                  </div>
                  <div className='flex w-full flex-row flex-wrap justify-center gap-2'>
                    <Skeleton className='h-10 w-[102px]' />
                    <Skeleton className='h-10 w-[91px]' />
                  </div>
                  <Skeleton className='h-10 w-full' />
                </>
              }
            >
              <ThemeDialogContent data={data} />
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerTitle className='hidden'>Theme Preview</DrawerTitle>
        <div className='m-4 mt-10 flex flex-col items-center gap-16'>
          <Suspense
            fallback={
              <>
                <div className='aspect-square w-full max-w-80 overflow-hidden rounded-xl'>
                  <Skeleton className='h-full w-full' />
                </div>
              </>
            }
          >
            <ThemeDialogContent data={data} />
          </Suspense>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function Scanner() {
  const [isTorchSupported, isTorchOn, toggleTorch] = useTorch()

  const [barcode, setBarcode] = useState<DetectedBarcode | null>(null)

  const [themeDialogOpen, setThemeDialogOpen] = useState(true)

  useEffect(() => {
    if (
      barcode &&
      !barcode.rawValue.startsWith('https://qr.josephabbey.dev/themes/')
    ) {
      const t = setTimeout(() => {
        startTransition(() => setBarcode(null))
      }, 5000)
      return () => clearTimeout(t)
    }
  }, [barcode])

  useEffect(() => {
    if (!themeDialogOpen) {
      const t = setTimeout(() => {
        startTransition(() => setBarcode(null))
      }, 5000)
      return () => clearTimeout(t)
    }
  }, [themeDialogOpen])

  let icon: string
  try {
    if (barcode)
      icon = `https://icons.duckduckgo.com/ip2/${new URL(barcode.rawValue).hostname}.ico`
    else icon = ''
  } catch {
    icon = ''
  }

  return (
    <>
      <div className='fixed bottom-0 z-50 flex h-16 w-full max-w-full items-center gap-4 bg-background bg-opacity-50 px-4 py-4 backdrop-blur md:px-6'>
        <Button
          className='min-w-0 flex-grow overflow-hidden'
          disabled={!barcode}
          onClick={() => {
            if (barcode) {
              window.open(barcode.rawValue, '_blank')
            }
          }}
        >
          {barcode && (
            <div
              className='mr-2 aspect-square h-4 w-4 min-w-4 bg-cover bg-center bg-no-repeat'
              style={{
                backgroundImage: `url(${icon})`,
              }}
            />
          )}
          <div className='min-w-0 flex-grow select-none overflow-hidden overflow-ellipsis text-center'>
            {barcode ? barcode.rawValue : 'No code detected'}
          </div>
        </Button>
        {isTorchSupported ?
          <Button
            onClick={toggleTorch}
            variant={isTorchOn ? 'default' : 'outline'}
            size='icon'
          >
            {isTorchOn ?
              <FlashlightOff />
            : <Flashlight />}
          </Button>
        : null}
      </div>
      <BarcodeScanner
        className='h-full w-full'
        onCapture={(barcode) =>
          startTransition(() => (setThemeDialogOpen(true), setBarcode(barcode)))
        }
      />
      {barcode?.rawValue.startsWith('https://qr.josephabbey.dev/themes/') && (
        <ThemeDialog
          id={barcode.rawValue.slice(34)}
          open={themeDialogOpen}
          setOpen={setThemeDialogOpen}
        />
      )}
    </>
  )
}

export default function ScannerPage() {
  return (
    <div className='h-svh max-h-svh w-full overflow-hidden'>
      <Nav className='fixed w-full border-b-0 bg-background bg-opacity-50 backdrop-blur'>
        <Link
          href='/'
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
          Generator
        </Link>
        <Link href='/scanner' className='font-bold text-foreground'>
          Scanner
        </Link>
        <Link
          href='/themes'
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
          Themes
        </Link>
        <Link
          href='/accounts'
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
          Accounts
        </Link>
      </Nav>
      <Scanner />
    </div>
  )
}
