import type { RequestHandler } from './$types';
import { prisma } from '$lib/db/prisma';

export const DELETE: RequestHandler = async (event: any) => {
	const session = await event.locals.getSession();
	const request = event.request;

	if (session?.user === undefined) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	const { threadId } = await request.json();

	try {

		await prisma.thread.delete({
			where: {
				id: threadId,
				userId: session.userId
			}
		});

		return new Response(JSON.stringify({ success: true }), { status: 200 });

	} catch (error) {
		console.error('Error deleting the thread:', error);
		return new Response(JSON.stringify({ error: 'Failed to delete thread' }), { status: 500 });
	}
};
