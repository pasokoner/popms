<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";

	import { page } from "$app/stores";
	import type { BaseLink, SubLink } from "$lib/config";
	import { ChevronDownIcon } from "lucide-svelte";
	import type { Snippet } from "svelte";

	type Props = {
		href: `/${string}`;
		label: string;
		sublinks?: SubLink[];
		children: Snippet;
	};

	let { href, label, sublinks = [], children }: Props = $props();

	let open = $state(sublinks.some((sublink) => $page.url.pathname.startsWith(sublink.href)));

	function isActiveHref(href: `/${string}`) {
		return $page.url.pathname.startsWith(href);
	}
</script>

{#if sublinks.length > 0}
	<Collapsible.Root {open}>
		<Collapsible.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant={isActiveHref(href) ? "default" : "ghost"}
				class="w-full justify-start gap-x-2 px-3 py-2 text-sm font-medium"
			>
				{@render children()}
				{label}
				<ChevronDownIcon class="ml-auto h-5 w-5" />
				<span class="sr-only">Toggle</span>
			</Button>
		</Collapsible.Trigger>
		<Collapsible.Content class="my-2 ml-6 flex flex-col items-center gap-y-2 border-l-2">
			{#each sublinks as sublink}
				<Button
					href={sublink.href}
					variant={isActiveHref(sublink.href) ? "default" : "ghost"}
					class="h-9 w-[95%] justify-start gap-x-2 px-3 py-2 text-sm font-medium"
				>
					{sublink.label}
				</Button>
			{/each}
		</Collapsible.Content>
	</Collapsible.Root>
{:else}
	<Button
		{href}
		variant={isActiveHref(href) ? "default" : "ghost"}
		class="w-full justify-start gap-x-2 px-3 py-2 text-sm font-medium"
	>
		{@render children()}
		{label}
	</Button>
{/if}
