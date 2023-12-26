<script>
	import { page } from '$app/stores';
	import '../app.css';
</script>

<svelte:head>
	<title>{$page.data.title}</title>
</svelte:head>

<slot />
