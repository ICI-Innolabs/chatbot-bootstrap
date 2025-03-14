<script lang="ts">
	import { mode } from 'mode-watcher';
	import { base } from '$app/paths';
	import markdownit from 'markdown-it';
	import hljs from 'highlight.js';
	import Typewriter from 'svelte-typewriter';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { Icons } from '$lib/components/icons';
	import { onMount } from 'svelte';

	let highlightTheme = $state('atom-one-dark');

	let {
	  newPromptEvent = $bindable(),
	  messages = $bindable(),
	  showTypewriter = $bindable(),
	} = $props();

	const md = markdownit({
		html: true,
		linkify: true,
		typographer: true,
		highlight: (str: string, lang: string): string => {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return (
						'<pre><code class="hljs">' +
						hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
						'</code></pre>'
					);
				} catch (__) {}
			}
			return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
		}
	});

	// Override the way links are rendered
	const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
	};

	md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      tokens[idx].attrPush(['class', 'text-blue-600 dark:text-blue-400']);
      return defaultRender(tokens, idx, options, env, self);
	};

	// This variable will hold the rendered markdown for the last AI message.
	let renderedOutput: string = $state('');

	let lastRenderedMessage: string = '';

	function handleFinishedTypewriting() {
		if (messages.length > 0) {
			renderedOutput = md.render(messages[messages.length - 1].content);
		}
	}

	function setHighlightTheme() {
		if ($mode === 'dark') {
			highlightTheme = 'atom-one-dark';
		} else {
			highlightTheme = 'atom-one-light';
		}
	}


	$effect(() => {
		setHighlightTheme();
		if (messages.length > 0) {
			const lastMsg = messages[messages.length - 1];
			if (lastMsg.role === 'ai' && lastMsg.content !== lastRenderedMessage) {
				if (lastMsg.content.length < 1000) {
					renderedOutput = ''; // clear the previous rendered output
				} else {
					renderedOutput = md.render(lastMsg.content);
				}

				lastRenderedMessage = lastMsg.content;
			}
		}
	});

	onMount(() => {
		setHighlightTheme();
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="{base}/{highlightTheme}.css" />
</svelte:head>

{#each messages as message, index}
	<div class="flex w-full flex-col py-2 text-sm lg:text-base {message.role === 'ai' ? 'mb-4' : ''}">
		<div class="group mx-auto w-full max-w-3xl rounded-lg px-5 py-2 dark:bg-gray-700">
			<!-- Header row -->
			<div class="mt-4 flex items-center justify-between">
				<div class="flex items-center">
					{#if message.role === 'human'}
						<Icons.user size="36" class="text-green-800 dark:text-sky-500" />
					{:else}
						<Icons.bot size="36" class="text-red-500" />
					{/if}
					<span class="ml-2 text-lg font-bold">
						{message.role === 'human' ? 'You' : 'AI'}
					</span>
				</div>
				{#if message.createdAt }
				<div class="text-xs font-medium text-gray-400">
					{new Date(message.createdAt).toLocaleString('sv-SE', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
						hour12: false
					})}
				</div>
				{/if}
			</div>

			<!-- Message content with some typewriting simulating streaming -->
			<div class="w-full overflow-x-auto pt-2">
				{#if message.role === 'ai' && index === messages.length - 1 && showTypewriter}
					{#if message.content.length > 1000}
						<!-- Show a skeleton loader while the markdown is being rendered -->
						<Skeleton height="200px" />
					{/if}
					{#if renderedOutput}
						<!-- Once typewriter is done, display the rendered markdown -->
						{@html renderedOutput}
					{:else}
						<!-- Show the typewriter effect until it’s done -->
						<Typewriter mode="concurrent" interval={1} on:done={handleFinishedTypewriting}>
							<div>{message.content}</div>
						</Typewriter>
					{/if}
				{:else if message.role === 'ai'}
					<!-- For other AI messages, render markdown immediately -->
					{@html md.render(message.content)}
				{:else}
					<!-- Human messages are displayed as plain text -->
					{message.content}
				{/if}
			</div>

			<!-- Action Buttons -->
			<div class="flex justify-start space-x-1 text-gray-700 dark:text-gray-500">
				<button
					class="edit-user-message-button invisible rounded p-1 transition hover:text-black group-hover:visible dark:hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-4 w-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
						></path>
					</svg>
				</button>
				<button
					class="invisible rounded p-1 transition hover:text-black group-hover:visible dark:hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-4 w-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
						></path>
					</svg>
				</button>
			</div>
		</div>
	</div>
{/each}
{#if newPromptEvent}
	<div class="flex w-full flex-col py-2 text-sm lg:text-base">
		<div class="group mx-auto w-full max-w-3xl rounded-lg px-5 py-2 dark:bg-gray-700">
			<div class="mt-4 flex items-center justify-between">
				<div class="flex items-center">
					<Icons.bot size="36" class="text-red-500" />
					<span class="ml-2 text-lg font-bold">AI</span>
				</div>
			</div>
			<div class="w-full flex flex-col items-center justify-center pt-4 pb-10">
				<Icons.loaderCircle size="48" class="text-red-500 dark:text-sky-500 motion-rotate-loop-[1turn]/reset motion-ease-linear" />
				<p class="mt-2 text-gray-500 dark:text-gray-400 text-sm">Waiting for AI...</p>
			</div>
		</div>
	</div>
{/if}
