<script lang="ts">
	import { animate } from 'motion';
	import { onMount } from 'svelte';
	import LogoImage from '$lib/images/logo_small2.png';
	import { goto } from '$app/navigation';

	let { fullname } = $props();

	onMount(() => {
		animate('#logo_welcome', { rotate: 360 }, { type: 'spring', repeat: Infinity, repeatDelay: 5 });
	});
</script>

<div class="m-auto max-w-md px-2 text-center">
	<div class="mt-8 flex justify-center">
		<div class="mb-1 flex -space-x-4">
			<img
				id="logo_welcome"
				src={LogoImage}
				class="w-14 rounded-full border-[1px] border-gray-200 dark:border-none"
				alt="logo"
				draggable="false"
			/>
		</div>
	</div>
	<div class="mb-5 mt-2 text-2xl font-semibold text-gray-800 dark:text-gray-100">
		<div class="line-clamp-1">Hello, {fullname}</div>
		<div>How can I help you today?</div>
	</div>
</div>
