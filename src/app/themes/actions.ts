'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function create() {
  const session = await auth()

  if (session == null || !session.user) {
    redirect('/accounts')
  }

  const theme = await prisma.theme.create({
    data: {
      users: {
        connect: {
          id: session.user.id!,
        },
      },
    },
  })
  redirect(`/themes/${theme.id}/edit`)
}
