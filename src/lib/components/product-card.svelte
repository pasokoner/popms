<script lang="ts">
	import type { Partner, Product } from "$lib/server/db/schema";

	import * as Card from "$lib/components/ui/card";

	type Props = {
		product: Product;
		partners: Partner[];
		avgPrice: number;
	};

	let { product, partners, avgPrice }: Props = $props();
</script>

<a href="/product/{product.id}" class="w-full max-w-96">
	<Card.Root class="h-full">
		<Card.Header>
			<Card.Title>{product.name}</Card.Title>
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
