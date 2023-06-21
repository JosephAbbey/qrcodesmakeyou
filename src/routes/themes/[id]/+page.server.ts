export const trailingSlash = 'always';

import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.getSession();
  const theme = await prisma.theme.findUnique({
    where: { id: event.params.id },
    include: { users: { where: { id: session?.user?.id ?? '' } } }
  });

  if (!theme)
    throw error(404, {
      message: 'Not found'
    });

  return { theme, saved: theme.users.length > 0 };
};
