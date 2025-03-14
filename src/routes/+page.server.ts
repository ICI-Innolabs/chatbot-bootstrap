import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event: { locals: { getSession: () => Promise<{ user?: any } | null> } }) => {
	const session = await event.locals.getSession();
	if (session?.user === undefined) {
		throw redirect(302, '/auth/login');
	}
	throw redirect(302, '/chat');
};
