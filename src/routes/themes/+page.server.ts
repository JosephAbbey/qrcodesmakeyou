export const trailingSlash = 'always';

import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.getSession();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      themes: true
    }
  });

  return { themes: user?.themes ?? [] };
};
