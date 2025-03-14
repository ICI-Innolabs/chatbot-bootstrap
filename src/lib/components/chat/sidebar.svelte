<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { fly } from 'svelte/transition';
	import { Icons } from '$lib/components/icons';
	import { Separator } from '$lib/components/ui/separator';
	import { onMount } from 'svelte';

	let {
	  hideSidebarEvent = $bindable(),
	  threads = $bindable(),
	  currentThread
	} = $props();

	async function deleteThread(threadId: string) {
		try {
			const response = await fetch(`/api/threads/delete`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					threadId: threadId
				})
			});

			if (response.ok) {
				toast.success('Thread has been deleted');
				threads = threads.filter((thread: { id: string }) => thread.id !== threadId);
				if (currentThread && currentThread.id === threadId) {
					goto('/chat/');
				}
			  
			} else {
				toast.error('Failed to delete thread');
			}
		} catch (error) {
			toast.error('Error deleting thread');
		}
	}

	function clickNewChat() {
		goto('/chat/');
	}

	onMount(() => {
	});
</script>

{#if !hideSidebarEvent}
	<div
		in:fly={{ x: -300, duration: 100 }}
		out:fly={{ x: -300, duration: 100 }}
		class="h-screen max-h-[100dvh] min-h-screen w-1/2 bg-gray-100 shadow-md dark:bg-gray-900 md:w-[280px]"
	>
		<div class="flex justify-between px-2">
			<button
				onclick={() => (hideSidebarEvent = true)}
				class="flex justify-center rounded-xl px-3.5 py-2 text-gray-600 transition hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
			>
				<Icons.panelLeftClose size="24" />
			</button>
			<button
				onclick={clickNewChat}
				class="flex justify-center rounded-xl px-3.5 py-2 text-gray-600 transition hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
			>
				<Icons.messageSquarePlus size="24" />
			</button>
		</div>
		<Separator class="my-4" />
		<div class="my-2 flex flex-1 flex-col space-y-1 overflow-y-auto pl-2">
			<div class="px-2 text-gray-500 dark:text-gray-400">Threads</div>
			{#each threads as thread}
				<div class="relative flex w-full items-center justify-between transition hover:bg-gray-200  dark:hover:bg-gray-800">
					<a
						class="flex flex-1 justify-between overflow-hidden text-ellipsis whitespace-nowrap rounded-sm px-2 py-1"
						href="/chat/{thread.id}"
						onclick={async (e) => {
							e.preventDefault();
							const { href } = e.currentTarget;
							goto(href);
						}}
					>
						<div class="flex w-full flex-1 self-center">
							<div class="w-full self-center text-left">
								{thread.title}
							</div>
						</div>
					</a>
					<button
						class="px-2 py-1 text-slate-500 transition hover:text-red-600"
						aria-label="Delete Thread"
						onclick={() => deleteThread(thread.id)}
					>
						<Icons.trash size="20" />
					</button>
				</div>
			{/each}
		</div>
	</div>
{/if}
