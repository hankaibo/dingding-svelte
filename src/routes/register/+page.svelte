<script>
	import { goto } from '$app/navigation';
	import { Label, Input, GradientButton, A, Img } from 'flowbite-svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const form = {
		email: '',
		password: '',
		firstName: '',
		lastName: ''
	};
	let confirmPassword = '';

	async function handleRegister() {
		if (!passwordMatch) {
			return;
		}
		const res = await fetch('/api/auth/email/register', {
			method: 'post',
			body: JSON.stringify(form),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (res.ok) {
			return goto('/login');
		}
	}

	const passwordMatch = () => {
		if (!form) {
			return false;
		}
		if (!form.password) {
			form.password = '';
		}
		return (form.password = confirmPassword);
	};

	function handleJumpLogin() {
		goto('/login');
	}
	function handleJumpForgot() {
		goto('/forgot');
	}
</script>

<div class="flex min-h-screen">
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
				<form>
					<div class="grid gap-6 mb-6 md:grid-cols-2">
						<div>
							<Label for="first_name" class="mb-2">First name</Label>
							<Input
								bind:value={form.firstName}
								type="text"
								id="first_name"
								placeholder="John"
								required
							/>
						</div>
						<div>
							<Label for="last_name" class="mb-2">Last name</Label>
							<Input
								bind:value={form.lastName}
								type="text"
								id="last_name"
								placeholder="Doe"
								required
							/>
						</div>
					</div>
					<div class="mb-6">
						<Label for="email" class="mb-2">Email address</Label>
						<Input
							bind:value={form.email}
							type="email"
							id="email"
							placeholder="john.doe@company.com"
							required
						/>
					</div>
					<div class="mb-6">
						<Label for="password" class="mb-2">Password</Label>
						<Input
							bind:value={form.password}
							type="password"
							id="password"
							placeholder="•••••••••"
							required
						/>
					</div>
					<div class="mb-6">
						<Label for="confirm_password" class="mb-2">Confirm password</Label>
						<Input
							bind:value={confirmPassword}
							type="password"
							id="confirm_password"
							placeholder="•••••••••"
							required
						/>
					</div>
					<div class="mb-6">
						<GradientButton
							on:click={handleRegister}
							type="submit"
							color="purpleToBlue"
							class="w-full">注册</GradientButton
						>
					</div>

					<div class="flex items-center justify-end mb-6">
						<A on:click={handleJumpForgot} class="text-sm font-medium hover:underline">忘记密码</A>
					</div>

					<p class="mt-10 text-center text-md text-gray-500">
						<span>已有账号？</span>
						<A on:click={handleJumpLogin} class="font-medium hover:underline">登录</A>
					</p>
				</form>
			</div>
		</div>
	</div>
</div>
