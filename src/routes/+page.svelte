<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select";
	import * as Card from "$lib/components/ui/card";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import Button from "$lib/components/ui/button/button.svelte";

	let { data } = $props();

	let q = $state($page.url.searchParams.get("q") || "");

	$effect(() => {
		let query = new URLSearchParams($page.url.searchParams.toString());

		if (!q) {
			query.delete("q");

			goto(`?${query.toString()}`, { keepFocus: true });

			return;
		}

		let timeoutId = setTimeout(() => {
			let query = new URLSearchParams($page.url.searchParams.toString());

			query.set("q", q.trim());

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
					<Select.Value placeholder="Theme" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="light">Light</Select.Item>
					<Select.Item value="dark">Dark</Select.Item>
					<Select.Item value="system">System</Select.Item>
				</Select.Content>
			</Select.Root>

			<Select.Root>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Theme" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="light">Light</Select.Item>
					<Select.Item value="dark">Dark</Select.Item>
					<Select.Item value="system">System</Select.Item>
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
						<Card.Root class="group col-span-3">
							<Card.Header>
								<Card.Title>{product.name}</Card.Title>
								<Card.Description>&#x20B1; {avgPrice} / {product.unit}</Card.Description>
							</Card.Header>
							<Card.Content class="flex gap-x-4">
								<div class="size-20 rounded-md bg-gray-200"></div>
								<div class="flex-1 text-sm text-muted-foreground">
									<p>Price: &#x20B1;{avgPrice}</p>
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
