<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import Label from "$lib/components/ui/label/label.svelte";
	import { MUNICIPALITIES } from "$lib/config";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import { SvelteURLSearchParams } from "svelte/reactivity";
	import DivWrapper from "$lib/components/div-wrapper.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import ProductCard from "$lib/components/product-card.svelte";

	let { data } = $props();

	const query = new URLSearchParams();

	let q = $state($page.url.searchParams.get("q") || "");

	let checkedMunicipality: string[] = $state([]);

	$effect(() => {
		if (q.length === 0) {
			query.delete("q");
		} else {
			query.set("q", q.trim());
		}

		if (checkedMunicipality.length > 0) {
			query.set("municipalities", checkedMunicipality.join(","));
		} else {
			query.delete("municipalities");
		}

		let timeoutId = setTimeout(() => {
			goto(`?${query.toString()}`, { keepFocus: true });
		}, 300);

		return () => {
			clearTimeout(timeoutId);
		};
	});
</script>

<main class="container flex-1 space-y-6 py-10">
	<DivWrapper class="flex items-center gap-x-2">
		<Input placeholder="Search..." class="flex-1" bind:value={q} />

		<Select.Root>
			<Select.Trigger class="w-[180px]">
				<Select.Value placeholder="Municipality" />
			</Select.Trigger>
			<Select.Content>
				<ScrollArea class="h-72">
					{#each MUNICIPALITIES as m}
						<div class="p-2">
							<Label class="flex items-center gap-x-2 text-sm">
								<input
									name="municipalities"
									type="checkbox"
									value={m}
									bind:group={checkedMunicipality}
									class="size-5 appearance-none rounded-md border bg-white checked:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-0"
								/>
								{m}
							</Label>
						</div>
					{/each}
				</ScrollArea>
				<Button
					variant="secondary"
					class="w-full underline"
					onclick={() => (checkedMunicipality = [])}>Clear Filter</Button
				>
			</Select.Content>
		</Select.Root>
	</DivWrapper>

	<!-- PRODUCT CARDS -->
	{#await data.products}
		LOADING...
	{:then products}
		{#if products.length > 0}
			<div class="grid grid-cols-12 place-items-center gap-6 sm:place-items-stretch">
				{#each products as { product, partners, avgPrice }}
					<div class="col-span-12 sm:col-span-6 sm:max-w-full md:col-span-4 xl:col-span-3">
						<ProductCard {product} {partners} {avgPrice} />
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex h-full w-full items-center justify-center py-4">No products found</div>
		{/if}
	{:catch error}
		<div class="flex h-full items-center justify-center py-10">
			Something went wrong <Button variant="link">reload</Button>!
		</div>
	{/await}
</main>
