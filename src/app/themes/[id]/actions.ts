'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function forget(id: string) {
  const session = await auth()

  if (session == null || !session.user) {
    return false
  }

  const theme = await prisma.theme.update({
    where: { id },
    data: {
      users: {
        disconnect: {
          id: session.user.id!,
        },
      },
    },
    include: { users: { where: { id: session.user.id! } } },
  })

  return theme.users.length > 0
}

export async function add(id: string) {
  const session = await auth()

  if (session == null || !session.user) {
    return false
  }

  const theme = await prisma.theme.update({
    where: { id },
    data: {
      users: {
        connect: {
          id: session.user.id!,
        },
      },
    },
    include: { users: { where: { id: session.user.id! } } },
  })

  return theme.users.length > 0
}
