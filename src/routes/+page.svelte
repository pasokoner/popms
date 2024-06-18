<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select";
	import * as Card from "$lib/components/ui/card";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import Button from "$lib/components/ui/button/button.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import { MUNICIPALITIES } from "$lib/config";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import { URLSearchParams } from "svelte/reactivity";

	let { data } = $props();

	const query = new URLSearchParams($page.url.searchParams);

	let q = $state($page.url.searchParams.get("q") || "");

	let checkedMunicipality: string[] = $state([]);

	$effect(() => {
		if (!q) {
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

<div class="flex min-h-screen flex-col">
	<header class="h-16 border-b">
		<div class="container flex h-full items-center justify-between">
			<h1 class="text-2xl font-bold">POPMS</h1>
		</div>
	</header>

	<main class="container flex-1 space-y-10 py-20">
		<div class="flex items-center gap-x-2">
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
		</div>

		<!-- PRODUCT CARDS -->
		{#await data.products}
			LOADING...
		{:then products}
			{#if products.length > 0}
				<div class="grid grid-cols-12 gap-6">
					{#each products as { product, partners, avgPrice }}
						<a href="/product/{product.id}" class="col-span-3">
							<Card.Root>
								<Card.Header>
									<Card.Title>{product.name}</Card.Title>
									<Card.Description>&#x20B1; {avgPrice} / {product.unit}</Card.Description>
								</Card.Header>
								<Card.Content class="flex gap-x-4">
									<div class="size-20 rounded-md bg-gray-200"></div>
									<div class="flex-1 text-sm text-muted-foreground">
										<p>AVG Price: &#x20B1;{avgPrice}</p>
										<p>Unit: {product.unit}</p>
									</div>
								</Card.Content>
								<Card.Footer class="flex-col items-start gap-y-1">
									<p class="text-sm font-medium text-muted-foreground">Lowest Price Guarantee</p>
									<div class="text-xs">
										{#each partners as partner}
											<p class="capitalize">{partner.name}</p>
										{/each}
									</div>
								</Card.Footer>
							</Card.Root>
						</a>
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
</div>
