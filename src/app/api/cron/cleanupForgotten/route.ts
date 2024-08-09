import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  // Delete all themes that are not linked to any user
  // This is a cron job that runs every day
  await prisma.theme.deleteMany({
    where: {
      users: {
        none: {},
      },
    },
  })

  return new Response('Themes cleanup successful', {
    status: 200,
  })
}
