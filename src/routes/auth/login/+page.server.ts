import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async (event: any) => {
	const session = await event.locals.getSession();
	if (session?.user) {
		throw redirect(302, '/');
	}

	return {};
};
