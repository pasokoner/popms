<script lang="ts">
	// Original email address
	import { MailIcon } from "lucide-svelte";
	const email = "example@example.com";
</script>

<main class="container flex h-96 items-center justify-center max-w-sm flex-col gap-y-1">
	<div class="rounded-full border p-4 bg-gradient-to-b from-gray-200 to-white">
		<div class="rounded-full border bg-white p-2">		
	<MailIcon class="size-8 stroke-current stroke-1"/>
	</div>
	</div>
	<div class="space-y-3 text-center">
		<h1 class="text-2xl font-bold">Check your e-mail!</h1>
		<p class="text-gray-500">
			We've just sent a password reset link to <span class="font-semibold">{email}</span>. Make sure to check your spam
			folder too.
		</p>
	</div>
</main>
