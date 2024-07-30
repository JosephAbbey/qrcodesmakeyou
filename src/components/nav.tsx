import { ColorSchemeToggle } from '@/components/color-scheme-toggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SiGithub } from '@icons-pack/react-simple-icons'
import { Menu, QrCode } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

export function Nav({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <header className='sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Link
          href='#'
          className='flex items-center gap-2 text-lg font-semibold md:text-base'
        >
          <QrCode className='h-6 w-6' />
          <span className='sr-only'>QRCodes Make You</span>
        </Link>
        {children}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <nav className='grid gap-6 text-lg font-medium'>
            <Link
              href='#'
              className='flex items-center gap-2 text-lg font-semibold'
            >
              <QrCode className='h-6 w-6' />
              <span className='sr-only'>QRCodes Make You</span>
            </Link>
            {children}
          </nav>
        </SheetContent>
      </Sheet>
      <div className='flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <ColorSchemeToggle />
        <Link href='https://github.com/JosephAbbey/qrcodesmakeyou'>
          <Button variant='outline' size='icon'>
            <SiGithub className='h-[1.2rem] w-[1.2rem]' />
            <span className='sr-only'>Source Code</span>
          </Button>
        </Link>
      </div>
    </header>
  )
}
