<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { Icons } from '$lib/components/icons';
	import { toggleMode } from 'mode-watcher';
	import { onMount, tick } from 'svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { toast } from 'svelte-sonner';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Popover from "$lib/components/ui/popover";
	import * as Table from "$lib/components/ui/table";

	let innerWidth = $state(0);
	let showSidebarButton = $state(true);
	let editMode = $state(false);
	let inputEl: HTMLInputElement | null = $state(null);
	let {
		currentThread = $bindable(),
		threads = $bindable(),
		hideSidebarEvent = $bindable(),
		session,
		threadStats,
	} = $props();

	let chatTitle = $state('Untitled');

	let showLogoutDialog = $state(false);

	function handleLogout() {
		showLogoutDialog = true;
	}

	function doSignout() {
		goto('/auth/signout');
	}

	function finishTitleEditKeyPress(event: KeyboardEvent) {
		if (event.type === 'keydown' && event.key === 'Enter') {
			finishTitleEdit(event);
		}
	}

	async function finishTitleEdit(event: KeyboardEvent) {
		editMode = false;
		if (!currentThread) return;

		try {
			const response = await fetch('/api/threads/update-title', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					threadId: currentThread.id,
					title: chatTitle
				})
			});

			if (!response.ok) {
				toast.error('Failed to save chat title');
				throw new Error('Failed to save chat title');
			}

			const updatedThread = { ...currentThread, title: chatTitle };
			currentThread = updatedThread; 

			threads = threads.map((thread: { id: string }) => (thread.id === updatedThread.id ? updatedThread : thread));
		} catch (e) {
			toast.error('Failed to save chat title');
		}
	}

	$effect(() => {
		if (currentThread) {
			chatTitle = currentThread.title;
		} else {
			chatTitle = 'Untitled';
		}
	});

	$effect(() => {
		if (editMode) {
			tick().then(() => {
				if (inputEl) {
					inputEl.focus();
					inputEl.select();
				}
			});
		}
	});
	$effect(() => {
		if (innerWidth > 1023) {
			showSidebarButton = true;
		} else {
			showSidebarButton = false;
		}
	});

	onMount(() => {});
</script>

<svelte:window bind:innerWidth />

<nav class="sticky top-0 z-30 flex flex-row justify-center py-4 backdrop-blur-xl">
	<div class="mx-auto flex w-full max-w-3xl px-3">
		<div class="flex w-full max-w-full items-center">
			<div class="hidden self-start pr-2 md:block">
				<button
					id="edit-chat-title"
					class="flex cursor-pointer rounded-lg p-2 transition dark:hover:bg-gray-700"
					aria-label="Edit Chat Title"
					onclick={() => (editMode = true)}
				>
					<div class="m-auto self-center">
						<Icons.filePenLine size="24" />
					</div>
				</button>
			</div>
			<div class="line-clamp-1 hidden flex-1 self-center font-medium md:block">
				{#if editMode}
					<input
						type="text"
						bind:this={inputEl}
						bind:value={chatTitle}
						class="w-full rounded border border-gray-200 bg-transparent p-2 outline-none dark:border-gray-700"
						onblur={() => (editMode = false)}
						onkeydown={finishTitleEditKeyPress}
					/>
				{:else}
					<button
						type="button"
						class="p-2"
						onclick={() => (editMode = true)}
						aria-label="Edit Chat Title">{chatTitle}</button
					>
				{/if}
			</div>
			<div class="ml-auto flex items-center space-x-2 self-start pl-2">
				{#if hideSidebarEvent || !showSidebarButton}
					<div class="relative" transition:fade>
						<button
							onclick={() => (hideSidebarEvent = false)}
							class="flex cursor-pointer rounded-lg p-2 transition dark:hover:bg-gray-700"
							aria-label="Open Sidebar"
						>
							<Icons.panelLeftOpen size="20" />
						</button>
						<span
							class="absolute right-0.5 top-0.5 grid min-h-[6px] min-w-[6px] -translate-y-1/4 translate-x-1/4 place-items-center rounded-full bg-red-500 px-1 py-1 text-xs text-white"
						></span>
					</div>
				{/if}
				{#if threadStats.totalTokens > 0}
					<Popover.Root>
						<Popover.Trigger>
							<button
								class="flex cursor-pointer rounded-lg mr-2 p-2 transition dark:hover:bg-gray-700"
								aria-label="Share"
							>
								<Icons.chartColumnStacked size="20" />
							</button>
						</Popover.Trigger>
						<Popover.Content class="dark:bg-slate-900">
							  <Table.Root>
								<Table.Caption>Tokens usage</Table.Caption>
								<Table.Body>
								  <Table.Row>
									<Table.Cell class="font-medium">Input tokens</Table.Cell>
									<Table.Cell class="text-right">{threadStats.promptTokens}</Table.Cell>
								  </Table.Row>
								  <Table.Row>
									<Table.Cell class="font-medium">Output tokens</Table.Cell>
									<Table.Cell class="text-right">{threadStats.completionTokens}</Table.Cell>
								  </Table.Row>
								  <Table.Row>
									<Table.Cell class="font-bold">Total tokens</Table.Cell>
									<Table.Cell class="text-right">{threadStats.totalTokens}</Table.Cell>
								  </Table.Row>
								</Table.Body>
							  </Table.Root>
						</Popover.Content>
					</Popover.Root>
				{/if}
				
				<button
					onclick={toggleMode}
					class="self-center mr-2 hover:scale-110 dark:hover:text-gray-300"
					id="open-settings-button"
					aria-label="Toggle theme"
				>
					<Icons.sun size="20" class="hidden transition-all dark:block dark:opacity-90" />
					<Icons.moon size="20" class="opacity-90 transition-all dark:hidden" />
					<span class="sr-only">Toggle theme</span>
				</button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Avatar.Root class="transition hover:scale-110">
							<Avatar.Image src={session?.user.image} alt="Avatar Image" />
							<Avatar.Fallback class="dark:bg-slate-800">
								<Icons.userRound size="24" />
							</Avatar.Fallback>
						</Avatar.Root>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="px-4 dark:bg-slate-900">
						<DropdownMenu.Group>
							<DropdownMenu.Label>My Account</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item class="dark:bg-slate-900">
								<button onclick={handleLogout} class="flex w-full items-center">
									<Icons.logOut size="20" class="mr-2" />
									Logout
								</button>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>
</nav>

{#if showLogoutDialog}
	<AlertDialog.Root bind:open={showLogoutDialog}>
		<AlertDialog.Content class="dark:bg-slate-900">
			<AlertDialog.Header>
				<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
				<AlertDialog.Description>
					Clicking Sign Out will end you current session. Clicking "Sign Out" will securely end your
					session.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel class="dark:bg-slate-900">Cancel</AlertDialog.Cancel>
				<AlertDialog.Action onclick={() => signOut()}>Sign Out</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
