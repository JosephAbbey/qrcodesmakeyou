import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const POST: RequestHandler = async (event) => {
  const session = await event.locals.getSession();
  if (!session?.user) throw error(401, 'Not logged in');

  await prisma.theme.update({
    where: { id: event.params.id },
    data: {
      users: {
        disconnect: {
          id: session?.user?.id ?? ''
        }
      }
    }
  });

  return new Response();
};
