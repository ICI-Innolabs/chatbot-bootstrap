<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';

	import * as Alert from '$lib/components/ui/alert/index.js';

	import Button from '$lib/components/ui/button/button.svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { Icons } from '$lib/components/icons';

	let errorMessage = $state<string | null>(null);
	let errorType = $state<string | null>(null);


	const unsubscribe = page.subscribe(($page) => {
		errorType = $page.url.searchParams.get('error');
		if (errorType === 'OAuthAccountNotLinked') {
			errorMessage =
				'Your email address is already associated with an account from a different provider. Please sign in using that provider.';
		} else {
			errorMessage = 'There was an error while trying to sign in. Please try again.';
		}
	});

	onDestroy(unsubscribe);

	let providerLoading = $state({
		google: false,
		github: false,
		twitter: false
	});
</script>

<div
	class="container absolute inset-0 flex h-full flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] md:w-[420px]">
			{#if errorType}
				<Alert.Root variant="destructive" class="dark:bg-slate-200">
					<Icons.circleAlert class="size-4" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{errorMessage}</Alert.Description>
				</Alert.Root>
			{/if}
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Login to your account</h1>
				<p class="text-sm text-muted-foreground">Use one of the following identity providers.</p>
			</div>
			<div class="flex flex-col space-y-4">
				<Button
					variant="outline"
					type="button"
					class="h-10 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-700 sm:mx-4 md:mx-10"
					on:click={() => {
						providerLoading['google'] = true;
						signIn('google');
					}}
				>
					{#if providerLoading['google']}
						<Icons.loader class="mr-2 h-4 w-4 motion-rotate-loop-[1turn]/reset" />
					{:else}
						<Icons.google class="mr-2 h-4 w-4" />
						Google
					{/if}
				</Button>
				<Button
					variant="outline"
					type="button"
					class="h-10 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-700 sm:mx-4 md:mx-10"
					on:click={() => {
						providerLoading['github'] = true;
						signIn('github');
					}}
				>
					{#if providerLoading['github']}
						<Icons.loader class="mr-2 h-4 w-4 motion-rotate-loop-[1turn]/reset" />
					{:else}
						<Icons.github class="mr-2 h-4 w-4" />
						Github
					{/if}
				</Button>
				<Button
					variant="outline"
					type="button"
					class="h-10 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-700 sm:mx-4 md:mx-10"
					on:click={() => {
						providerLoading['twitter'] = true;
						signIn('twitter');
					}}
				>
					{#if providerLoading['twitter']}
						<Icons.loader class="mr-2 h-4 w-4 motion-rotate-loop-[1turn]/reset" />
					{:else}
						<Icons.twitter class="mr-2 h-4 w-4" />
						Twitter
					{/if}
				</Button>
			</div>
			<!-- <UserAuthForm /> -->
			<p class="px-4 text-center text-sm text-muted-foreground">
				By choosing to log in to our services, you agree to our

				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>

				and

				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>
