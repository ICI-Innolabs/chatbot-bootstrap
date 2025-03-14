import { v4 as uuidv4 } from 'uuid';
import { MessagesAnnotation, Annotation, START, END, StateGraph } from '@langchain/langgraph';
import { SystemMessage, ToolMessage } from '@langchain/core/messages';

import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { DuckDuckGoSearch } from '@langchain/community/tools/duckduckgo_search';
import { ChatOpenAI } from '@langchain/openai';
import { MemorySaver } from '@langchain/langgraph';
import { HumanMessage } from '@langchain/core/messages';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { BaseMessage, AIMessage } from '@langchain/core/messages';
import { SqliteSaver } from '@langchain/langgraph-checkpoint-sqlite';
import { env } from '$env/dynamic/private';
import dotenv from 'dotenv';

dotenv.config();

const agentTools = [new TavilySearchResults({ maxResults: 3 })];
// const agentTools = [new DuckDuckGoSearch({ maxResults: 3 })];

const agentModel = new ChatOpenAI({
	temperature: 0,
	model: env.OPENAI_MODEL ?? 'gpt-4o-mini',

});

const AgentState = Annotation.Root({
	messages: Annotation<BaseMessage[]>({
		reducer: (x, y) => x.concat(y)
	})
});

const toolNode = new ToolNode<typeof AgentState.State>(agentTools);
const boundModel = agentModel.bindTools(agentTools);

function shouldContinue(state: typeof AgentState.State): 'action' | typeof END {
	const lastMessage = state.messages[state.messages.length - 1];
	// If there is no function call, then we finish
	if (lastMessage && !(lastMessage as AIMessage).tool_calls?.length) {
		return END;
	}
	return 'action';
}

async function callModel(state: typeof AgentState.State) {
	const response = await boundModel.invoke(state.messages);
	return { messages: [response] };
}

// define the workflow
const workflow = new StateGraph(AgentState)
	.addNode('agent', callModel)
	.addNode('action', toolNode)
	.addConditionalEdges('agent', shouldContinue)
	.addEdge(START, 'agent')
	.addEdge('action', 'agent');

export class Agent {
	private agent;
	private checkpointer;
	private threadId: string;

	constructor(threadId?: string) {
		this.threadId = threadId ?? uuidv4();
		const dbUrl = process.env.LANGCHAIN_DATABASE_URL;
		const databasePath = dbUrl?.split(':')[1] || 'langchain.db';

		this.checkpointer = SqliteSaver.fromConnString(databasePath);

		this.agent = workflow.compile({
			checkpointer: this.checkpointer
		});
	}

	public async getThreadId() {
		return this.threadId;
	}

	async invoke(message: string) {
		const result = await this.agent.invoke(
			{ messages: [new HumanMessage(message)] },
			{ configurable: { thread_id: this.threadId } }
		);
		return result;
	}

	public async getState(){
		return this.agent.getState(
			{ configurable: { thread_id: this.threadId } }
		);
	}

}
