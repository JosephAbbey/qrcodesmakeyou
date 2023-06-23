export const trailingSlash = 'always';

import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';

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

  if (theme.users.length <= 0) throw redirect(307, '..');

  return { theme };
};
