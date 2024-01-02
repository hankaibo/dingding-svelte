<script>
	import { navigating, page } from '$app/stores';
	import Nav from '$lib/components/Nav.svelte';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import '../app.css';
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<Nav />

<main>
	<slot />
</main>
