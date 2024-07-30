import prisma from '@/lib/prisma'
import { User } from 'next-auth'
import { redirect } from 'next/navigation'

export type ThemeType = Awaited<ReturnType<typeof getThemes>>[number]

export async function getThemes(user: User) {
  return (
    (
      await prisma.user.findUnique({
        where: { id: user.id! },
        include: {
          themes: true,
        },
      })
    )?.themes ?? []
  )
}

export async function getTheme(user: User, id: string) {
  const theme = await prisma.theme.findUnique({
    where: { id },
    include: { users: { where: { id: user.id! } } },
  })

  if (theme == null) {
    redirect('/themes')
  }

  return { theme, added: theme.users.length > 0 }
}
