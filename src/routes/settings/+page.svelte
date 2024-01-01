<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Label, Input, Avatar, Dropzone, GradientButton } from 'flowbite-svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let value = [];
	const dropHandle = (event) => {
		value = [];
		event.preventDefault();
		if (event.dataTransfer.items) {
			[...event.dataTransfer.items].forEach((item, i) => {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					value.push(file.name);
					value = value;
				}
			});
		} else {
			[...event.dataTransfer.files].forEach((file, i) => {
				value = file.name;
			});
		}
	};

	const handleChange = (event) => {
		const files = event.target.files;
		if (files.length > 0) {
			value.push(files[0].name);
			value = value;
		}
	};

	const showFiles = (files) => {
		if (files.length === 1) return files[0];
		let concat = '';
		files.map((file) => {
			concat += file;
			concat += ',';
			concat += ' ';
		});

		if (concat.length > 40) concat = concat.slice(0, 40);
		concat += '...';
		return concat;
	};
</script>

<svelte:head>
	<title>设置</title>
</svelte:head>

<div class="w-[800px] m-auto space-y-8">
	<div class="text-center">
		<h2 class="mt-6 text-3xl font-bold text-gray-900">个人信息</h2>
	</div>

	<form
		use:enhance={() => {
			return ({ update }) => {
				update({ reset: false });
			};
		}}
		method="post"
		action="?/save"
	>
		<div class="grid gap-6 grid-cols-2">
			<div class="mb-6">
				{#if $page.data.user.photo}
					<Label for="email" class="mb-2">头像</Label>
					<Avatar class="w-full h-full" />
				{:else}
					<Dropzone
						id="dropzone"
						on:drop={dropHandle}
						on:dragover={(event) => {
							event.preventDefault();
						}}
						on:change={handleChange}
					>
						<svg
							aria-hidden="true"
							class="mb-3 w-10 h-10 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/></svg
						>
						{#if value.length === 0}
							<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
								<span class="font-semibold">Click to upload</span> or drag and drop
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								PNG, JPG or GIF (MAX. 800x400px)
							</p>
						{:else}
							<p>{showFiles(value)}</p>
						{/if}
					</Dropzone>
				{/if}
			</div>
			<div>
				<div class="grid gap-6 mb-6 md:grid-cols-2">
					<div>
						<Label for="first_name" class="mb-2">First name</Label>
						<Input
							name="firstName"
							type="text"
							id="first_name"
							bind:value={data.user.firstName}
							required
						/>
					</div>
					<div>
						<Label for="last_name" class="mb-2">Last name</Label>
						<Input
							name="lastName"
							type="text"
							id="last_name"
							bind:value={data.user.lastName}
							required
						/>
					</div>
				</div>
				<div class="mb-6">
					<Label for="oldPassword" class="mb-2">密码</Label>
					<Input name="oldPassword" type="password" id="oldPassword" required />
				</div>
				<div class="mb-6">
					<Label for="password" class="mb-2">新密码</Label>
					<Input name="password" type="password" id="password" required />
				</div>
				<div class="mb-6">
					<GradientButton type="submit" color="purpleToBlue" class="w-full">更新</GradientButton>
				</div>
			</div>
		</div>
	</form>
	<form use:enhance method="post" action="?/logout">
		<button class="">登出</button>
	</form>
</div>
