<script>
	import { LockIcon } from "lucide-svelte";
</script>
<main class="container flex h-96 items-center justify-center max-w-sm flex-col gap-y-3">
	<div class="rounded-full border p-4 bg-gradient-to-b from-gray-200 to-white">
		<div class="rounded-full border bg-white p-2">
	<LockIcon class="size-8 stroke-current stroke-1"/>
	</div></div>
	<div class="space-y-2 text-center p-1">
		<h1 class="text-[24px] font-semibold">Reset Password</h1>
			<p class="text-gray-500 text-16px">Enter your email to reset your password.</p>
				<hr class="border-t-2 my-4 w-full border-gray-300" />
			<p class="text-black text-left text-[14px] font-semibold">Email Address</p>
		<input
			type="email"
			class="text-sm w-full rounded-lg border-2 border-gray-300 h-10 p-2"
			placeholder="amon@pixel.com"
		/>
		<button class="mb-10 h-10 w-full rounded-lg border bg-green-800 text-[14px] text-white hover:bg-green-900"
			>Send Reset Link</button
		>
	</div>
</main>
