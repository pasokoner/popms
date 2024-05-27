<script>
	import "../app.pcss";
	import { Toaster } from "$lib/components/ui/sonner";
</script>

<svelte:head>
	<title>POPMS</title>
</svelte:head>

<Toaster richColors theme="light" />

<slot />
