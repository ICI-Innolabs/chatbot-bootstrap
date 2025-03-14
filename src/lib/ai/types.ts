import type { StateType } from '@langchain/langgraph';
import { type MessageContent } from '@langchain/core/messages';

export type AIState = {
	input: string;
	threadId: string;
	output: MessageContent;
	state: StateType<any>;
};
