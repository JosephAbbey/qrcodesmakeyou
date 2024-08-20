'use server'

import prisma from '@/lib/prisma'

export async function deleteAccount(id: string) {
  await prisma.account.delete({
    where: {
      id: id,
    },
  })
}
