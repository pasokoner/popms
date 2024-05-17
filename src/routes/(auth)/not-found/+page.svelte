<script>
	import { FrownIcon } from "lucide-svelte";
</script>
<main class="container flex h-96 items-center justify-center max-w-sm flex-col gap-y-2">
	<div class="space-y-2 text-center">
		<div class="container flex justify-center">
			<div class="rounded-full border p-4 bg-gradient-to-b from-gray-200 to-white">
				<div class="rounded-full border bg-white p-2">
					<FrownIcon class="size-8 stroke-current stroke-1"/>
			</div>
		</div>
	</div>
		<!-- <span class="flex justify-center text-sm">
			<img
				src="https://media1.tenor.com/m/tTaCJqHvuLwAAAAC/pleading-puppy-eyes.gif"
				alt="gif"
				class="w-20"
			/>
		</span> -->
		<h1 class="text-2xl font-bold">Ooops!</h1>
		<p class="text-md text-gray-400">
			We couldn't find an account associated with this email.
		</p>
		<button class="mb-10 h-10 w-full rounded-xl border bg-green-700 text-white hover:bg-green-800"
			>Try Again</button
		>
	</div>
</main>
