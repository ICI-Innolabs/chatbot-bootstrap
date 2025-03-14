<script lang="ts">
	import { Icons } from '$lib/components/icons';
	import { toggleMode } from 'mode-watcher';
	import { onMount } from 'svelte';

	onMount(() => {

	});
	let { children } = $props();
</script>

<nav class="sticky top-0 z-30 flex flex-row justify-center py-4 backdrop-blur-xl">
	<div class="mx-auto flex w-full max-w-3xl px-3">
		<div class="flex w-full items-center justify-between">
			<!-- Left side (optional for a logo or title) -->
			<div class="flex items-center space-x-4">
				<!-- Add your logo or title here if needed -->
			</div>

			<!-- Right side (menu items and theme toggle) -->
			<div class="flex items-center space-x-6 ml-auto">
				<a href="/about-us" class="text-sm font-medium hover:underline">
					About
				</a>
				<a href="https://www.innolabs.ro" class="text-sm font-medium hover:underline">
					ICI Innolabs
				</a>
				<button
					onclick={toggleMode}
					class="self-center dark:hover:text-gray-300"
					id="open-settings-button"
					aria-label="Toggle theme">
					<Icons.sun size=20 class="transition-all hidden dark:block dark:opacity-50" />
					<Icons.moon size=20 class="transition-all opacity-50 dark:hidden" />
					<span class="sr-only">Toggle theme</span>
				</button>
			</div>
		</div>
	</div>
</nav>

<!-- Content below the navbar -->
<div class="flex flex-col min-h-screen">
	<div class="flex flex-row flex-1 overflow-auto">
		{@render children()}
	</div>
</div>
