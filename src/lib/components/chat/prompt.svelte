<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { Icons } from '$lib/components/icons';
	import ChatExamples from '$lib/components/chat/examples.svelte';

	let submitable = $state(false);
	let prompt = $state('');
	let exampleSelection = $state('');

	let {
		newPromptEvent = $bindable(),
		messages = $bindable(),
		userPrompt = $bindable(),
		thread
	} = $props();

	
	let formEl: HTMLFormElement | null = null;
	let textareaEl: HTMLTextAreaElement | null = null;

	function resizeTextarea(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		target.style.height = 'auto';
		target.style.height = Math.min(target.scrollHeight, 10 * 24) + 'px'; // 24px is the approximate height of one line
	}

	function submitForm() {
		if (submitable) {
			submitable = false;
			newPromptEvent = true;
			userPrompt = prompt;

		    messages.push({
			  id: messages.length,
			  role: 'human',
			  content: prompt,
			});
		  
			prompt = '';
			formEl?.requestSubmit();
		  
			if (textareaEl) {
				textareaEl.style.height = 'auto';
				textareaEl.focus();
			}
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			event.preventDefault();
			submitForm();
		}
	}

	onMount(() => {
		if (textareaEl) {
			textareaEl.addEventListener('keydown', handleKeyDown);
		}
		let user_agent = window.navigator.userAgent;
		let placeholder = 'Type in and Ctrl+Enter to send';
		if (user_agent.includes('Macintosh')) {
			placeholder = 'Type in and Cmd+Enter to send';
		}
		textareaEl?.setAttribute('placeholder', placeholder);
		textareaEl?.focus();
	});

	$effect(() => {
		if (exampleSelection.length > 0) {
			prompt = exampleSelection;
			exampleSelection = '';
		}
	});

	$effect(() => {
		let stripped_text = prompt.replace(/\s/g, '');
		if (stripped_text.length == 0) {
			prompt = prompt.trim();
		}
		submitable = prompt.length > 0;
	});
</script>

<div class="w-full py-1">
	{#if messages.length === 0}
		<div class="inset-x-0 mx-auto -mb-0.5 flex justify-center bg-transparent px-2.5">
			<ChatExamples bind:exampleSelection />
		</div>
	{/if}
	<div class="mt-10">
		<div class="inset-x-0 mx-auto max-w-3xl px-2.5">
			<div class="pb-2">
				<form
					method="POST"
					action="?/chat"
					bind:this={formEl}
					use:enhance={submitForm}
					class="relative flex w-full flex-col rounded-3xl border border-gray-100 bg-gray-50 px-1.5 dark:border-gray-700 dark:bg-gray-900"
				>
					<div class="flex">
						<div class="mb-2 ml-1 self-end">
							<button
								class="rounded-full bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600"
								type="button"
								aria-label="Add"
							>
								<Icons.plus size="20" />
							</button>
						</div>
						<textarea
							name="prompt"
							id="chat-textarea"
							class="w-full resize-none rounded-xl bg-gray-50 px-3 py-3 text-sm outline-none dark:bg-gray-900 md:text-base"
							style="max-height: 240px; overflow-y: auto;"
							placeholder="Type your message"
							rows="1"
							bind:value={prompt}
							bind:this={textareaEl}
							disabled={newPromptEvent}
							oninput={resizeTextarea}
						>
						</textarea>
						<div class="mb-2 mr-1 flex space-x-1 self-end">
							<button
								id="voice-input-button"
								class="mr-0.5 self-center rounded-full bg-gray-50 p-1.5 transition hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-600"
								type="button"
								aria-label="Voice Input"
							>
								<Icons.mic size="20" />
							</button>
							{#if submitable}
								<button
									class="self-center rounded-full bg-gray-100 p-1.5 transition motion-blur-in-md hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
									type="submit"
									aria-label="Send"
								>
									<Icons.arrowUp size="20" />
								</button>
							{:else}
								<button
									disabled
									class="self-center rounded-full bg-gray-100 p-1.5 text-gray-300 dark:bg-gray-800 dark:text-gray-600"
									type="button"
									aria-label="Send"
								>
									<Icons.arrowUp size="20" />
								</button>
							{/if}
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	/* Hide scrollbar but allow scrolling */
	textarea::-webkit-scrollbar {
		display: none;
	}
	textarea {
		scrollbar-width: none;
	}
</style>
