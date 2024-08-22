import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  // Delete all users that are not linked to any accounts
  // This is a cron job that runs every day
  await prisma.user.deleteMany({
    where: {
      accounts: {
        none: {},
      },
    },
  })

  // Delete all expired sessions
  await prisma.session.deleteMany({
    where: {
      expires: {
        lt: new Date(),
      },
    },
  })

  return new Response('Users cleanup successful', {
    status: 200,
  })
}
