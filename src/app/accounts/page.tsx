import { AccountRow } from './client'
import { auth, signIn, signOut } from '@/auth'
import { Nav } from '@/components/nav'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { SiGithub, SiYoutube, SiSpotify } from '@icons-pack/react-simple-icons'
import { Session } from 'next-auth'
import Link from 'next/link'
import { Suspense } from 'react'

async function AccountsList({ session }: { session: Session }) {
  if (!session.user) return <></>

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      accounts: {
        orderBy: [
          {
            provider: 'asc',
          },
          {
            username: 'asc',
          },
        ],
      },
    },
  })

  if (!user) return <></>

  return (
    <>
      {user.accounts.map((account) => (
        <AccountRow key={account.id} account={account} />
      ))}
    </>
  )
}

async function AccountsCard() {
  const session = await auth()

  if (session == null) {
    return (
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>
            Login with any of the following services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <form
              action={async () => {
                'use server'
                await signIn('google')
              }}
            >
              <Button
                type='submit'
                variant='outline'
                className='flex w-full gap-2'
              >
                <SiYoutube className='mr-2 h-4 w-4' />
                Login with Google
              </Button>
            </form>
            <form
              action={async () => {
                'use server'
                await signIn('spotify')
              }}
            >
              <Button
                type='submit'
                variant='outline'
                className='flex w-full gap-2'
              >
                <SiSpotify className='mr-2 h-4 w-4' />
                Login with Spotify
              </Button>
            </form>
            <form
              action={async () => {
                'use server'
                await signIn('github')
              }}
            >
              <Button
                type='submit'
                variant='outline'
                className='flex w-full gap-2'
              >
                <SiGithub className='mr-2 h-4 w-4' />
                Login with GitHub
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Link Accounts</CardTitle>
          <CardDescription>
            Login with any of the following services to link it to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <form
              action={async () => {
                'use server'
                await signIn('google')
              }}
            >
              <Button
                type='submit'
                variant='outline'
                className='flex w-full gap-2'
              >
                <SiYoutube className='mr-2 h-4 w-4' />
                Login with Google
              </Button>
            </form>
            <form
              action={async () => {
                'use server'
                await signIn('spotify')
              }}
            >
              <Button
                type='submit'
                variant='outline'
                className='flex w-full gap-2'
              >
                <SiSpotify className='mr-2 h-4 w-4' />
                Login with Spotify
              </Button>
            </form>
            <form
              action={async () => {
                'use server'
                await signIn('github')
              }}
            >
              <Button
                type='submit'
                variant='outline'
                className='flex w-full gap-2'
              >
                <SiGithub className='mr-2 h-4 w-4' />
                Login with GitHub
              </Button>
            </form>
            <div className='flex flex-row items-center gap-4 text-center text-muted-foreground before:h-0 before:flex-grow before:outline before:outline-1 before:outline-muted after:h-0 after:flex-grow after:outline after:outline-1 after:outline-muted'>
              or
            </div>
            <form
              action={async () => {
                'use server'
                await signOut()
              }}
            >
              <Button
                type='submit'
                variant='destructive'
                className='flex w-full gap-2'
              >
                Logout
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
      <Suspense fallback={<></>}>
        <Card className='w-full max-w-sm'>
          <CardHeader>
            <CardTitle className='text-2xl'>Linked Accounts</CardTitle>
            <CardDescription>Accounts linked to your device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4'>
              <AccountsList session={session} />
            </div>
          </CardContent>
        </Card>
      </Suspense>
    </>
  )
}

export default function Accounts() {
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
        <Link
          href='/themes'
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
          Themes
        </Link>
        <Link href='/accounts' className='font-bold text-foreground'>
          Accounts
        </Link>
      </Nav>
      <main className='my-4 flex flex-grow flex-col items-center justify-center gap-4'>
        <Suspense fallback={<></>}>
          <AccountsCard />
        </Suspense>
      </main>
    </div>
  )
}
