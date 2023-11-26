<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	$: if (browser) {
		goto('/user');
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
