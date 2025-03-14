import type { Actions, PageServerLoad } from './$types.js';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { prisma } from '$lib/db/prisma';
import { redirect } from '@sveltejs/kit';
import { Agent } from '$lib/ai/agents';
import { generateThreadTitle } from '$lib/ai/utils';

export const load: PageServerLoad = async (event: any) => {
	const session = await event.locals.getSession();
	const params = event.params;

	if (session?.user === undefined) {
		throw redirect(302, '/auth/login');
	}

	let currentThread;
	let messages: any[] = [];

	const thread_id = params.thread as string | null;

	if (thread_id) {
		currentThread = await prisma.thread.findUnique({
			where: {
				id: thread_id,
				userId: session.userId
			},
			include: {
				messages: true
			}
		});
		if (currentThread === null) {
			throw redirect(302, '/');
		}
		messages = currentThread.messages;
	}

	const threads = await prisma.thread.findMany({
		where: {
			userId: session.userId
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return {
		messages: messages,
		currentThread: currentThread,
		threads: threads,
		session: session

	};
};

export const actions: Actions = {
	chat: async (event: any) => {
		const request = event.request;
		const session = await event.locals.getSession();

		if (session === undefined) {
			redirect(302, '/auth/login');
		}

		let agent;
		let threadId = event.params.thread ?? null;

		const data = await request.formData();
		let prompt = data.get('prompt') as string | '';
		let thread;
		let shouldGenerateTitle = false;

		prompt = prompt.trim();

		if (!threadId) {
			agent = new Agent();
			threadId = await agent.getThreadId();

			thread = await prisma.thread.create({
				data: {
					title: 'Untitled',
					id: threadId,
					userId: session.userId
				}
			});

			shouldGenerateTitle = true;

		} else {
			thread = await prisma.thread.findUnique({
				where: {
					id: threadId,
					userId: session.userId
				}
			});
			if (thread === null) {
				return {
					errorMessage: 'Thread not found'
				};
			}
			shouldGenerateTitle = !thread.statusGenTitle;
			agent = new Agent(threadId);
		}

		const state = await agent.invoke(prompt);
		const content = state.messages[state.messages.length - 1].content.toString();
		const tokenUsage = state.messages[state.messages.length - 1].response_metadata.tokenUsage;

		if (shouldGenerateTitle) {
			const title = await generateThreadTitle(prompt, content);
			await prisma.thread.update({
				where: {
					id: threadId
				},
				data: {
					title: title,
					statusGenTitle: true
				}
			});
		}

		let msg;
		try {
			await prisma.message.create({
				data: {
					threadId: threadId,
					content: prompt,
					role: 'human',
				}
			});

			msg = {
					threadId: threadId,
					content: content,
					role: 'ai',
					promptTokens: tokenUsage.promptTokens,
					completionTokens: tokenUsage.completionTokens,
					totalTokens: tokenUsage.totalTokens
			}

			await prisma.message.create(
				{
					data: msg
				}
			);
		} catch (error) {
			return {
				errorMessage: 'Failed to save message to database'
			};
		}

		return {
			AIMessage: msg
		};
	}
} satisfies Actions;
