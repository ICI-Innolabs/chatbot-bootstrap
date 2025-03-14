<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Icons } from '$lib/components/icons';

	let { exampleSelection = $bindable() } = $props();

	onMount(() => {});

</script>

<div class="flex w-full max-w-3xl flex-col">
	<div class="relative"></div>
	<div class="relative w-full">
		<div class="mb-3 w-full text-left md:p-1">
			<div class="flex flex-wrap-reverse px-2 text-left">
				{#snippet example(
					first_line = 'Tell me a fun fact',
					second_line = 'about the Roman Empire'
				)}
					<div class=" basis-full p-[5px] px-1 sm:basis-1/2">
						<button
							class="group flex h-full w-full flex-1 justify-between rounded-2xl bg-gray-50
                        px-4 py-2.5 transition hover:bg-gray-200 hover:motion-blur-in-sm dark:bg-gray-700 dark:hover:bg-gray-900"
							onclick={() => {
								exampleSelection = first_line + ' ' + second_line;
							}}
						>
							<div class="flex flex-col self-center text-left">
								<div class="text-sm font-medium dark:text-gray-300">
									{first_line}
								</div>
								<div class="line-clamp-1 text-sm text-gray-500">
									{second_line}
								</div>
							</div>
							<div
								class="self-center rounded-lg p-1 text-gray-50 transition group-hover:text-gray-800 dark:text-gray-700 dark:group-hover:text-gray-100"
							>
								<Icons.chevronsUp size="16" />
							</div>
						</button>
					</div>
				{/snippet}
				{@render example('What is today\'s stock value for NVIDIA', 'Make sure to include the source.')}
				{@render example('What is the projected global GDP for 2025?', 'And include the link to the source.')}
				{@render example('What is the weather like in', 'New York today?')}
				{@render example('Tell me a fun fact', 'about the Roman Empire')}
			</div>
		</div>
	</div>
</div>
