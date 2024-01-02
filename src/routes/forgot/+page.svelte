<script>
	import { Label, Input, GradientButton, A, Img, Span } from 'flowbite-svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="flex h-[calc(100vh-73px)]">
	<div class="flex flex-auto">
		<Img
			bind:src={data.url}
			alt="sample 1"
			class="sm:w-1/2 xl:w-3/5 h-full overflow-hidden bg-no-repeat bg-cover transition-all duration-300 blur-sm hover:blur-none"
		/>
		<div
			class="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full xl:w-2/5 p-8 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white"
		>
			<div class="max-w-md w-full space-y-8">
				<div class="text-center">
					<h2 class="mt-6 text-3xl font-bold text-gray-900">找回密码</h2>
				</div>
				<form method="post">
					<div class="mb-6">
						<Label for="email" class="mb-2">Email address</Label>
						<Input name="email" type="email" id="email" required />
					</div>

					<div class="mb-6">
						<GradientButton type="submit" color="purpleToBlue" class="w-full">Send</GradientButton>
					</div>

					<div class="flex items-center justify-end mb-6">
						<A href="/register" class="text-sm font-medium hover:underline">注册</A>
					</div>

					<p class="mt-10 text-center text-md">
						<Span class="text-gray-500">已有账号？</Span>
						<A href="/login" class="font-medium hover:underline">登录</A>
					</p>
				</form>
			</div>
		</div>
	</div>
</div>
