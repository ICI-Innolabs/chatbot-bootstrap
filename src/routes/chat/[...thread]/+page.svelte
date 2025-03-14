<script lang="ts">
	import ChatNavbar from '$lib/components/chat/navbar.svelte';
	import ChatWelcome from '$lib/components/chat/welcome.svelte';
	import ChatPromptInput from '$lib/components/chat/prompt.svelte';
	import ChatMessages from '$lib/components/chat/messages.svelte';
	import ChatSidebar from '$lib/components/chat/sidebar.svelte';
	import type { Message } from '$lib/types';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let newPromptEvent = $state(false);
	let showTypewriter = $state(false);
	let innerWidth = $state(0);
	let hideSidebarEvent = $state(true);
	let userPrompt = $state('');
	let messages = $state<Message[]>([]);
	let threads = $state<
		{ id: string; createdAt: Date; updatedAt: Date; userId: string; title: string }[]
	>([]);

	let { data, form } = $props();

	let chatContentEl: HTMLElement;

	const scrollToBottom = async (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	$effect(() => {
		showTypewriter = false;
		threads = data.threads;
		messages = data.messages;
	});

	$effect(() => {
		if (innerWidth > 1023) {
			hideSidebarEvent = false;
		} else {
			hideSidebarEvent = true;
		}
	});

	$effect(() => {
		if (newPromptEvent) {
			scrollToBottom(chatContentEl);
		}
	});

	$effect(() => {
		if (form) {
			newPromptEvent = false;
			userPrompt = '';
			if (form.errorMessage) {
				toast.error(form.errorMessage);
			} else {
				showTypewriter = true;
				if (data.currentThread === undefined) {
					if (form.AIMessage && form.AIMessage.threadId) {
						goto(`/chat/${form.AIMessage.threadId}`);
					}
				}
			}
		}
	});

	onMount(() => {
		messages = data.messages;
	});
</script>

<svelte:window bind:innerWidth />

<div class="flex min-h-screen flex-row overflow-auto">
	<!-- Sidebar -->
	<div class="fixed left-0 top-0 z-40 text-sm transition">
		<ChatSidebar bind:hideSidebarEvent bind:threads currentThread={data.currentThread} />
	</div>

	<!-- Main chat container -->
	<div
		class="relative flex max-h-screen min-h-screen w-full flex-col {hideSidebarEvent
			? ''
			: 'sidebar-visible'}"
	>
		<!-- Navbar -->
		<ChatNavbar
			currentThread={data.currentThread}
			bind:hideSidebarEvent
			bind:threads
			session={data.session}
		/>

		<!-- Scrollable chat messages area -->
		<div bind:this={chatContentEl} class="flex-1 overflow-auto pb-24">
			{#if messages.length === 0}
				<div class="flex h-full items-center justify-center">
					<ChatWelcome fullname={data.session.user.name} />
				</div>
			{:else}
				<ChatMessages bind:messages bind:newPromptEvent bind:showTypewriter />
			{/if}
		</div>

		<!-- Fixed prompt input -->
		<div class="absolute bottom-0 left-0 w-full">
			<ChatPromptInput
				bind:newPromptEvent
				bind:messages
				bind:userPrompt
				thread={data.currentThread}
			/>
		</div>
	</div>
</div>

<style>
	.sidebar-visible {
		margin-left: 280px;
	}
</style>
