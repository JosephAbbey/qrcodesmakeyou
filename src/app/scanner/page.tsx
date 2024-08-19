'use client'

import { Nav } from '@/components/nav'
import { Button } from '@/components/ui/button'
import { Flashlight, FlashlightOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  BarcodeScanner,
  type DetectedBarcode,
  useTorch,
} from 'react-barcode-scanner'
import 'react-barcode-scanner/polyfill'

function Scanner() {
  const [isTorchSupported, isTorchOn, toggleTorch] = useTorch()

  const [barcode, setBarcode] = useState<DetectedBarcode | null>(null)

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
            {barcode ? barcode.rawValue : 'No barcode detected'}
          </div>
        </Button>
        {isTorchSupported || true ?
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
        onCapture={(barcode) => {
          setBarcode(barcode)
        }}
      />
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
