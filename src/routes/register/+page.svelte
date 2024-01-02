<script>
	import { enhance } from '$app/forms';
	import { Label, Input, GradientButton, A, Img } from 'flowbite-svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	// 利用 sveltekit 的增强函数enhance，实现如下功能：
	// 验证表单中的密码与确认密码是否相等，如果不相等禁止提交；相等，则提交。
	function handleEnhance({ data, action, cancel, submitter }) {
		console.log('----->', data);
		const password = data.get('password');
		const confirmPassword = data.get('confirmPassword');
		if (password !== confirmPassword) {
			cancel();
		}
		return async ({ update }) => {
			// update();
		};
	}
</script>

<svelte:head>
	<title>注册</title>
</svelte:head>

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
					<h2 class="mt-6 text-3xl font-bold text-gray-900">注册账号</h2>
				</div>
				<form method="post">
					<div class="grid gap-6 mb-6 md:grid-cols-2">
						<div>
							<Label for="first_name" class="mb-2">First name</Label>
							<Input name="firstName" type="text" id="first_name" placeholder="John" required />
						</div>
						<div>
							<Label for="last_name" class="mb-2">Last name</Label>
							<Input name="lastName" type="text" id="last_name" placeholder="Doe" required />
						</div>
					</div>
					<div class="mb-6">
						<Label for="email" class="mb-2">Email address</Label>
						<Input name="email" type="email" id="email" required />
					</div>
					<div class="mb-6">
						<Label for="password" class="mb-2">Password</Label>
						<Input name="password" type="password" id="password" placeholder="•••••••••" required />
					</div>
					<div class="mb-6">
						<Label for="confirm_password" class="mb-2">Confirm password</Label>
						<Input name="confirmPassword" type="password" id="confirm_password" required />
					</div>
					<div class="mb-6">
						<GradientButton type="submit" color="purpleToBlue" class="w-full">注册</GradientButton>
					</div>

					<div class="flex items-center justify-end mb-6">
						<A href="/forgot" class="text-sm font-medium hover:underline">忘记密码</A>
					</div>

					<p class="mt-10 text-center text-md text-gray-500">
						<span>已有账号？</span>
						<A href="/login" class="font-medium hover:underline">登录</A>
					</p>
				</form>
			</div>
		</div>
	</div>
</div>
