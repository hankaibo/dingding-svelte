<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider
	} from 'flowbite-svelte';
	import '../../app.css';

	/** @type {import('./$types').LayoutData}*/
	export let data;

	async function handleLogout() {
		await fetch('/api/auth/logout', {
			method: 'post',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		});
		localStorage.clear();
		return goto('/login');
	}
</script>

<svelte:head>
	<title>{$page.data.title}</title>
</svelte:head>

<Navbar class="border-b border-gray-200">
	<NavBrand href="/">
		<img
			src="https://svelte.dev/_app/immutable/assets/svelte-logo.5c5d7d20.svg"
			class="mr-3 h-6 sm:h-9"
			alt="Svelte Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Hi</span>
	</NavBrand>
	<div class="flex items-center md:order-2">
		<Avatar
			class="cursor-pointer"
			id="avatar-menu"
			src="https://svelte.dev/_app/immutable/assets/svelte-logo.5c5d7d20.svg"
		/>
		<NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
	</div>
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
			<span class="block text-sm">Bonnie Green</span>
			<span class="block truncate text-sm font-medium">name@flowbite.com</span>
		</DropdownHeader>
		<DropdownItem>Settings</DropdownItem>
		<DropdownDivider />
		<DropdownItem on:click={handleLogout}>Sign out</DropdownItem>
	</Dropdown>
	<NavUl>
		{#each data.navs as item}
			<NavLi href={item.href}>{item.title}</NavLi>
		{/each}
	</NavUl>
</Navbar>

<main class="container mx-auto">
	<slot />
</main>
