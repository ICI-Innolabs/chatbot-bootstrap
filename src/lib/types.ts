export type Message = {
	message: string;
	role: 'human' | 'ai';
	timestamp: number;
	finished: boolean | false;
};
