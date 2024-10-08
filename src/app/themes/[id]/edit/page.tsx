import { getTheme } from '../../themes'
import { ThemeInnerClient } from './client'
import { Nav } from '@/components/nav'
import { Skeleton } from '@/components/ui/skeleton'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

async function ThemeInner({ id }: { id: string }) {
  const session = await auth()

  if (session == null || !session.user) {
    redirect('/accounts')
  }

  return <ThemeInnerClient {...await getTheme(session.user, id)} />
}

export default function Theme({ params }: { params: { id: string } }) {
  return (
    <div className='flex min-h-screen w-full flex-col'>
      <Nav>
        <Link
          href='/'
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
          Generator
        </Link>
        <Link
          href='/scanner'
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
          Scanner
        </Link>
        <Link href='/themes' className='font-bold text-foreground'>
          Themes
        </Link>
        <Link
          href='/accounts'
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
          Accounts
        </Link>
      </Nav>
      <main className='m-4 flex flex-col items-center gap-16'>
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
          <ThemeInner id={params.id} />
        </Suspense>
      </main>
    </div>
  )
}
