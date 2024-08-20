'use server'

import { getTheme as _getTheme } from '@/app/themes/themes'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function getTheme(id: string) {
  const session = await auth()

  if (session == null || !session.user) {
    redirect('/accounts')
  }

  return await _getTheme(session.user, id)
}
