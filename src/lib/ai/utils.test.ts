import { describe, expect, it } from 'vitest';
import { generateThreadTitle } from './utils';

describe(
	'generateThreadTitle',
	() => {
		test('generate a thread title', async () => {
            let userPrompt = "What is the meaning of life?";
            let AIResponse = "The meaning of life is to be happy.";
            let title = await generateThreadTitle(userPrompt, AIResponse);
            console.log(title);
            expect(title).toBeDefined();
		});
	},
	{
		timeout: 30000
	}
);
