<script>
	import {
		Label,
		Helper,
		Input,
		Button,
		GradientButton,
		Checkbox,
		A,
		Hr,
		Img
	} from 'flowbite-svelte';
	import { FacebookSolid, TwitterSolid, GoogleSolid, AppleSolid } from 'flowbite-svelte-icons';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<svelte:head>
	<title>登录</title>
</svelte:head>

<div class="h-[calc(100vh-73px)] flex">
	<div
		class="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0"
	>
		<Img
			bind:src={data.url}
			alt="login logo"
			class="sm:w-1/2 xl:w-3/5 h-full overflow-hidden bg-no-repeat bg-cover transition-all duration-300 blur-sm hover:blur-none"
		/>
		<div
			class="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full xl:w-2/5 p-8 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white"
		>
			<div class="max-w-md w-full space-y-8">
				<div class="text-center">
					<h2 class="mt-6 text-3xl font-bold text-gray-900">欢迎回来！</h2>
				</div>
				<div class="flex flex-row justify-center items-center space-x-3">
					<Button
						class="bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-[#3b5998]/50  dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
					>
						<FacebookSolid size="sm" />
					</Button>
					<Button
						class="bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-[#1da1f2]/50 dark:focus:ring-[#1da1f2]/55 mr-2 mb-2"
					>
						<TwitterSolid size="sm" />
					</Button>
					<Button
						class="bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-[#4285F4]/50 dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
					>
						<GoogleSolid size="sm" />
					</Button>
					<Button
						class=" bg-[#050708] hover:bg-[#050708]/90  focus:ring-[#050708]/50  dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mr-2 mb-2"
					>
						<AppleSolid size="sm" />
					</Button>
				</div>
				<div class="space-x-2">
					<Hr classHr="my-8 w-full"
						><span class="text-gray-300 font-normal">or continue with</span></Hr
					>
				</div>

				<form method="post">
					<div class="mb-6">
						<Label for="email" class="mb-2">Email address</Label>
						<Input name="email" type="email" id="email" required />
						{#if form?.errors?.email}
							<Helper class="mt-2" color="red">{form.errors.email}</Helper>
						{/if}
					</div>
					<div class="mb-6">
						<Label for="password" class="mb-2">Password</Label>
						<Input name="password" type="password" id="password" placeholder="•••••••••" required />
						{#if form?.errors?.password}
							<Helper class="mt-2" color="red">{form.errors.password}</Helper>
						{/if}
					</div>

					<div class="mb-6">
						<GradientButton type="submit" color="purpleToBlue" class="w-full">登录</GradientButton>
					</div>

					<div class="flex items-center justify-between mb-6">
						<Checkbox>记住我</Checkbox>
						<A href="/forgot" class="text-sm font-medium hover:underline">忘记密码</A>
					</div>

					<p class="mt-10 text-center text-md">
						<span class="text-gray-500">没有账号？</span>
						<A href="/register" class="font-medium hover:underline">注册</A>
					</p>
				</form>
			</div>
		</div>
	</div>
</div>
