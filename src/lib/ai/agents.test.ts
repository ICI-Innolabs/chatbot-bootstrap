import { v4 as uuidv4 } from 'uuid';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { describe, expect, it } from 'vitest';
import { Agent } from './agents.ts';

describe(
	'agent',
	() => {
		test('agent should be defined', () => {
			let agent = new Agent();
			expect(agent).toBeDefined();
		});

		test('agent should return a response', async () => {
			const thread_id = uuidv4();

			let agent = new Agent(thread_id);

			let result = await agent.invoke('Who are you');

			expect(result).toBeDefined();
			expect(result.messages).toBeDefined();
			expect(result.messages.length).toBeGreaterThan(0);
		});

		test('agent state history', async () => {
			const thread_id = uuidv4();

			let agent = new Agent(thread_id);
			const firstQuestion = 'What color is a polar bear? Give one word answer.';
			await agent.invoke(firstQuestion);

			let anotherAgent = new Agent(thread_id);
			const secondQuestion = 'What was my first question?';
			let result = await anotherAgent.invoke(secondQuestion);

			expect(result).toBeDefined();
			expect(result.messages).toBeDefined();
			expect(result.messages.length).toBe(4);

			let msg = result.messages[0];
			expect(msg).toBeInstanceOf(HumanMessage);
			expect(msg.content).toBe(firstQuestion);

			msg = result.messages[1];
			expect(msg).toBeInstanceOf(AIMessage);
			expect(msg.content).toMatch(/white/i);

			msg = result.messages[2];
			expect(msg).toBeInstanceOf(HumanMessage);
			expect(msg.content).toBe(secondQuestion);

			let yetanotherAgent = new Agent(thread_id);
			let state = await yetanotherAgent.getState();
			expect(state.values['messages'].length).toBe(4);
		});
	},
	{
		timeout: 30000
	}
);
