<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	import DivWrapper from "$lib/components/div-wrapper.svelte";
	import DataTable from "./data-table.svelte";
	import Prices from "./prices.svelte";
	import { format } from "date-fns";

	let { data } = $props();

	let domainLeft = $derived.by(() => {
		let min = Infinity;
		let max = -Infinity;

		data.latestPrices.forEach(({ partnerProducts }) => {
			partnerProducts.forEach(({ price }) => {
				min = Math.min(min, Number(price));
				max = Math.max(max, Number(price));
			});
		});

		return [min, max];
	});

	let domainBottom = $derived.by(() => {
		let dates: Date[] = [];

		data.latestPrices.forEach(({ partnerProducts }) => {
			partnerProducts.forEach(({ updatedAt }) => {
				dates.push(new Date(updatedAt));
			});
		});

		let sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
		let formattedDates = sortedDates.map((date) => format(date, "MM-dd-yyyy HH:mm"));

		return formattedDates;
	});

	let lineChartData = $derived.by(() => {
		let datas: {
			group: string;
			key: string;
			value: number;
		}[] = [];

		data.latestPrices.forEach(({ partnerProducts, name }) => {
			partnerProducts.forEach(({ price, updatedAt }) => {
				datas.push({
					group: name,
					key: format(new Date(updatedAt), "MM-dd-yyyy HH:mm"),
					value: Number(price)
				});
			});
		});

		return datas;
	});

	$inspect(data.latestPrices);
</script>

<main class="container flex-1 space-y-6 py-10">
	<DivWrapper>
		<Prices
			title={data.product.name + " Datasets"}
			data={lineChartData}
			{domainLeft}
			{domainBottom}
		/>
	</DivWrapper>

	<DivWrapper>
		<DataTable data={data.latestPrices} />
	</DivWrapper>
</main>
