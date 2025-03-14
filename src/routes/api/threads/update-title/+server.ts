import type { RequestHandler } from './$types';
import { prisma } from '$lib/db/prisma';

export const POST: RequestHandler = async (event: any) => {
	const session = await event.locals.getSession();
	const request = event.request;

	if (session?.user === undefined) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	const { threadId, title } = await request.json();

	try {

		await prisma.thread.update({
			where: { id: threadId },
			data: { title }
		});

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Error updating title:', error);
		return new Response(JSON.stringify({ error: 'Failed to update title' }), { status: 500 });
	}
};
