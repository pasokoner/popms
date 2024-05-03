<script lang="ts">
	import { cn } from "$lib/utils";
	import Button from "$lib/components/ui/button/button.svelte";

	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import NavLink from "$lib/components/nav-link.svelte";
	import { links } from "$lib/config";

	let sidebarOpen = $state(false);

	let userType: "admin" = $state("admin");

	let currentLinks = $derived(links[userType]);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
</script>

{#if sidebarOpen}
	<Button
		variant="outline"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 sm:hidden"
		onclick={toggleSidebar}
	/>
{/if}

<aside
	class={cn(
		"fixed left-0 top-0 z-50 flex h-screen w-64 -translate-x-full flex-col border-r transition-transform md:translate-x-0",
		sidebarOpen ? "translate-x-0" : "-translate-x-full"
	)}
>
	<div class="flex h-16 items-center justify-center border-b px-4 py-2">
		<h1 class="text-center text-2xl font-bold">PMOS</h1>
	</div>

	<div class="flex flex-1 flex-col space-y-5 p-5">
		<ScrollArea class="flex-1">
			{#each currentLinks as link}
				<NavLink href={link.href} label={link.label} sublinks={link.sublinks}>
					<svelte:component this={link.icon} class="h-5 w-5" />
				</NavLink>
			{/each}
		</ScrollArea>
	</div>
</aside>

<div class="flex min-h-screen flex-col md:ml-64">
	<header class="flex h-16 w-full items-center justify-between border-b" />

	<main class="flex-1"><slot /></main>
</div>
