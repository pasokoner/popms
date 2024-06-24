<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
	}

	let { children, ...rest }: Props = $props();
</script>

<div {...rest} class={cn("rounded-sm bg-white p-4 ", rest.class)}>
	{@render children()}
</div>
