export type Message = {
	id: string;
	createdAt: Date;
	userId: string;
	threadId: string;
	content: string;
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
};
