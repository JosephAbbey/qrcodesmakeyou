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
import { Skeleton } from '@/components/ui/skeleton'
import { SiGithub, SiYoutube, SiSpotify } from '@icons-pack/react-simple-icons'
import Link from 'next/link'
import { Suspense } from 'react'

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
          <div className='text-center text-muted-foreground'>or</div>
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
          href='/themes'
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
          Themes
        </Link>
        <Link href='/accounts' className='font-bold text-foreground'>
          Accounts
        </Link>
      </Nav>
      <main className='flex flex-grow flex-col items-center justify-center'>
        <Suspense fallback={<></>}>
          <AccountsCard />
        </Suspense>
      </main>
    </div>
  )
}
