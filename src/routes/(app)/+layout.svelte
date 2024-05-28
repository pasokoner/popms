<script lang="ts">
	import { cn } from "$lib/utils";
	import Button from "$lib/components/ui/button/button.svelte";

	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import NavLink from "$lib/components/nav-link.svelte";
	import { links } from "$lib/config";
	import { LogOutIcon, Building2Icon } from "lucide-svelte";

	let { data } = $props();

	let sidebarOpen = $state(false);

	let role = $derived(data.user.role);

	let currentLinks = $derived(links[role]);

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
		<h1 class="text-center text-2xl font-bold">POPMS</h1>
	</div>

	<div class="flex flex-1 flex-col space-y-5 p-5 pb-12">
		{#if role !== "admin"}
			<div class="flex items-center gap-x-3 px-1">
				<Building2Icon class="size-10 rounded-full bg-gray-200 stroke-1 p-1.5" />
				<div class="flex-1">
					<div class="line-clamp-2 text-xs text-gray-950">{data.user.name}</div>
					<div class="text-xs capitalize text-gray-500">{data.user.role}</div>
				</div>
			</div>
		{/if}

		<ScrollArea class="flex-1">
			<div class="mb-2.5 text-xs font-medium text-gray-400">MENU</div>
			{#each currentLinks as link}
				<NavLink href={link.href} label={link.label} sublinks={link.sublinks}>
					<svelte:component this={link.icon} class="h-5 w-5" />
				</NavLink>
			{/each}
		</ScrollArea>
		<form method="post" action="/logout">
			<input type="hidden" />
			<Button variant="outline" type="submit" class="w-full gap-x-2 px-3 py-2 text-sm font-medium">
				<LogOutIcon class="mr-2 h-5 w-5" />
				Logout
			</Button>
		</form>
	</div>
</aside>

<div class="flex min-h-screen flex-col md:ml-64">
	<header class="flex h-16 w-full items-center justify-between border-b" />

	<main class="container flex-1 pb-40 pt-6"><slot /></main>
</div>
