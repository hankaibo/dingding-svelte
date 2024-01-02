<script>
	import { page } from '$app/stores';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader
	} from 'flowbite-svelte';

	$: activeUrl = $page.url.pathname;
</script>

<Navbar class="border-b border-gray-200">
	<NavBrand href="/">
		<img
			src="https://svelte.dev/_app/immutable/assets/svelte-logo.5c5d7d20.svg"
			class="mr-3 h-6 sm:h-9"
			alt="Svelte Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Svelte</span>
	</NavBrand>
	<div class="flex items-center md:order-2">
		{#if $page.data.user}
			<Avatar class="cursor-pointer" id="avatar-menu" bind:src={$page.data.user.photo} />
		{:else}
			<Avatar class="cursor-pointer" id="avatar-menu" />
		{/if}
		<NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
	</div>
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		{#if $page.data.user}
			<DropdownHeader>
				<span class="block text-sm">{$page.data.user.lastName + $page.data.user.firstName}</span>
				<span class="block truncate text-sm font-medium">{$page.data.user.email}</span>
			</DropdownHeader>
			<DropdownItem href="/settings">设置</DropdownItem>
		{:else}
			<DropdownItem href="/login">登录</DropdownItem>
		{/if}
	</Dropdown>
	<NavUl {activeUrl}>
		<NavLi href="/">Home</NavLi>
		{#if $page.data.user?.role?.name === 'Admin'}
			<NavLi href="/user">User</NavLi>
		{/if}
		<NavLi href="/about">About</NavLi>
	</NavUl>
</Navbar>
