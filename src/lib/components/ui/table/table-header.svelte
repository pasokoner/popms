<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLTableSectionElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<thead
	class={cn("bg-gray-100 text-gray-400 [&_tr]:border-b", className)}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</thead>
