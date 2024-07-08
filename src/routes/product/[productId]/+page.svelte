<script lang="ts">
	import { URLSearchParams } from "svelte/reactivity";
	import ChartLine from "./chart-line.svelte";
	import DataTable from "./data-table.svelte";
	import { untrack } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { format } from "date-fns";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card";
	import DivWrapper from "$lib/components/div-wrapper.svelte";
	import { Skeleton } from "$lib/components/ui/skeleton";

	let { data } = $props();

	let url = new URLSearchParams($page.url.searchParams);

	let chartDatasets = $derived.by(() => {
		// let grouped = data.chartData.map((v) => {
		// 	return {
		// 		data: v.partnerProducts.map((p) => p.price),

		// 		label: v.partnerProducts.map((p) => format(p.createdAt, "dd/MM"))
		// 	};
		// });

		let datasets: { label: string; data: number | string[] }[] = [];

		if (!data.chartData) return datasets;

		datasets.push({
			label: data.chartData.name,
			data: data.chartData.partnerProducts.map((v) => v.price)
		});

		return datasets;
	});

	let chartLabels = $derived.by(() => {
		if (!data.chartData) return [];

		const allDates = data.chartData.partnerProducts.map((v) => new Date(v.createdAt));
		const sortedDates = allDates.sort((a, b) => a.getTime() - b.getTime());

		return sortedDates.map((d) => format(d, "MM/dd"));
	});

	$effect(() => {
		if (!url.get("partner")) {
			untrack(() => {
				let partner: string = "";

				for (let i = 0; i < data.partners.length; i++) {
					if (data.partners[i].partnerProducts.length > 0) {
						partner = data.partners[i].name;
					}
				}

				if (partner) {
					url.set("partner", partner);
					goto(`?${url.toString()}`, { replaceState: true });
				}
			});
		}
	});

	$inspect(data.chartData);
	$inspect(chartLabels);
</script>

<div class="space-y-6">
	<DivWrapper class="flex h-[560px] gap-x-8 shadow-md">
		<Tabs.Root value="chart" class="flex-1">
			<Tabs.List class=" bg-white">
				<Tabs.Trigger
					value="chart"
					class="font-bold data-[state=active]:bg-white data-[state=active]:underline data-[state=active]:underline-offset-4 data-[state=active]:shadow-none"
					>Chart</Tabs.Trigger
				>
				<Tabs.Trigger
					value="table"
					class="font-bold data-[state=active]:bg-white data-[state=active]:underline data-[state=active]:underline-offset-4 data-[state=active]:shadow-none"
					>Table</Tabs.Trigger
				>
			</Tabs.List>

			<Tabs.Content value="chart">
				{#if chartDatasets.length > 0 && chartLabels.length > 0}
					<ChartLine labels={chartLabels} datasets={chartDatasets} />
				{/if}
			</Tabs.Content>
		</Tabs.Root>

		<ScrollArea class="w-96">
			{#await data.products}
				<Skeleton class="h-[40px] w-full rounded-full" />
			{:then products}
				{#if products.length > 0}
					<div class="flex flex-col gap-y-2">
						{#each products as { product, partners, avgPrice }}
							<a href="/product/{product.id}" class="w-full">
								<Card.Root class="h-full">
									<Card.Header class="p-4 py-2">
										<Card.Title class="text-base">{product.name}</Card.Title>
									</Card.Header>
									<Card.Content class="flex gap-x-4 p-4 py-2">
										<div class="size-10 rounded-md bg-gray-200"></div>
										<div class="flex-1 text-sm text-muted-foreground">
											<p>AVG Price: &#x20B1;{avgPrice}</p>
											<p>Unit: {product.unit}</p>
										</div>
									</Card.Content>
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
		</ScrollArea>
	</DivWrapper>

	<DivWrapper>
		<DataTable data={data.partners} />
	</DivWrapper>
</div>
