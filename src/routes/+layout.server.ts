import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.getSession();
  if (!session?.user && event.url.pathname != '/') throw redirect(307, '/auth/signin');

  return {
    session
  };
};
