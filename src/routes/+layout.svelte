<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import '../app.css';
	import { onMount } from 'svelte';


	onMount(() => {
	});
	let { children } = $props();

</script>

<ModeWatcher />
<Toaster />
{@render children()}
