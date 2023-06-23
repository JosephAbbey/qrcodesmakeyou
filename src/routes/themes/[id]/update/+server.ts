import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import type { Theme } from '@prisma/client';

export const POST: RequestHandler = async (event) => {
  const session = await event.locals.getSession();
  if (!session?.user) throw error(401, 'Not logged in');

  const body: Omit<Theme, 'id'> = await event.request.json();

  await prisma.theme.update({
    where: { id: event.params.id },
    data: {
      light: body.light,
      dark: body.dark,
      corners_path: body.corners_path,
      corners_fill: body.corners_fill
    }
  });

  return new Response();
};
