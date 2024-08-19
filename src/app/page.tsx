import QRCodeSection from './qrcode-section'
import { Quicks } from '@/app/quicks'
import { Themes } from '@/app/themes'
import { Nav } from '@/components/nav'
import Link from 'next/link'
import * as React from 'react'

export default function Home({
  searchParams,
}: {
  searchParams: Record<string, string> & {
    shared_url?: string
    shared_text?: string
  }
}) {
  return (
    <div className='flex min-h-screen w-full flex-col'>
      <Nav>
        <Link href='/' className='font-bold text-foreground'>
          Generator
        </Link>
        <Link
          href='/scanner'
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
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
      <QRCodeSection
        defaultUrl={searchParams.shared_url ?? searchParams.shared_text}
        quicks={<Quicks />}
        themes={<Themes />}
      />
    </div>
  )
}
