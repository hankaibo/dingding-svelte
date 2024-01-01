<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div>
	{#if $page.status === 404}
		<h1 class="my-40 mx-0 text-center">Not found!</h1>
	{:else}
		<h1 class="my-40 mx-0 text-center">Something went wrong</h1>
	{/if}
</div>
