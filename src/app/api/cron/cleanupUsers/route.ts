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
  await prisma.user.deleteMany({
    where: {
      accounts: {
        none: {},
      },
    },
  })

  return new Response('Users cleanup successful', {
    status: 200,
  })
}
