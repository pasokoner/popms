<script>
	import "../app.pcss";
	import { Toaster } from "$lib/components/ui/sonner";
	import { page } from "$app/stores";

	let { children, data } = $props();
</script>

<svelte:head>
	<title>POPMS</title>
</svelte:head>

<Toaster richColors theme="light" />

{#if !$page.url.pathname.startsWith("/app")}
	<div class="flex min-h-screen flex-col">
		<header class="flex h-20 w-full items-center justify-between border-b bg-white">
			<div class="container flex h-full items-center">
				<a href="/">
					<h1 class="text-3xl font-bold">POPMS</h1>
				</a>
			</div>
		</header>

		<div class="flex-1 py-10">
			<main class="container">
				{@render children()}
			</main>
		</div>
	</div>
	<footer class="min-h-96 bg-black">
		<div class="container"></div>
	</footer>
{:else}
	{@render children()}
{/if}
