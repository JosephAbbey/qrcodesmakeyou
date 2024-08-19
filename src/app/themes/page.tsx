import { create } from './actions'
import { Theme } from './theme'
import { getThemes } from '@/app/themes/themes'
import { auth } from '@/auth'
import { Nav } from '@/components/nav'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

async function ThemesInner() {
  const session = await auth()

  if (session == null || !session.user) {
    redirect('/accounts')
  }

  const themes = await getThemes(session.user)

  return themes.map((theme) => <Theme key={theme.id} theme={theme} />)
}

export default function Themes() {
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
      <ScrollArea className='h-[calc(100svh-9rem)]'>
        <div className='mx-auto grid w-full max-w-3xl grid-cols-2 gap-2 p-2 lg:grid-cols-4'>
          <Suspense
            fallback={new Array(18).fill(null).map((_, i) => (
              <Skeleton key={i} className='aspect-square' />
            ))}
          >
            <ThemesInner />
          </Suspense>
        </div>
      </ScrollArea>
      <form action={create} className='fixed bottom-4 right-4'>
        <Button type='submit' className='flex gap-2'>
          <PlusCircle /> New
        </Button>
      </form>
    </div>
  )
}
