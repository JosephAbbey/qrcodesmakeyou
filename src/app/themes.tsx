import { getThemes } from './themes/themes'
import { Theme } from '@/app/theme'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import * as React from 'react'

export async function Themes() {
  const session = await auth()

  if (session == null || !session.user) {
    return (
      <div>
        You need to setup{' '}
        <Link href='/accounts' className='text-accent-foreground underline'>
          accounts
        </Link>{' '}
        to use this feature.
      </div>
    )
  }

  const themes = await getThemes(session.user)

  return (
    <div className='grid grid-cols-2 gap-2 p-2 lg:grid-cols-4'>
      <Theme theme={null} />
      {themes.map((theme) => (
        <Theme key={theme.id} theme={theme} />
      ))}
    </div>
  )
}
