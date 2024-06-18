<script lang="ts">
	import { URLSearchParams } from "svelte/reactivity";
	import ChartLine from "./chart-line.svelte";
	import DataTable from "./data-table.svelte";
	import { untrack } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { format } from "date-fns";

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

		return sortedDates.map((d) => format(d, "dd/MM"));
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
					goto(`?${url.toString()}`);
				}
			});
		}
	});

	$inspect(data.chartData);
	$inspect(chartLabels);
</script>

<main class="container space-y-6 py-10">
	<div class="flex items-center justify-center">
		<div class="w-full max-w-3xl flex-1">
			{#if chartDatasets.length > 0 && chartLabels.length > 0}
				<!-- content here -->
				<ChartLine labels={chartLabels} datasets={chartDatasets} />
			{/if}
		</div>
	</div>

	<DataTable data={data.partners} />
</main>
