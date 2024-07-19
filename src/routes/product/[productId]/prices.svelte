<script lang="ts">
	import { LineChart, ScaleTypes, type LineChartOptions } from "@carbon/charts-svelte";
	import "@carbon/charts-svelte/styles.css";

	type Props = {
		title: string;
		data: {
			group: string;
			key: string;
			value: number;
		}[];
		domainLeft: number[];
		domainBottom: string[];
	};

	let { data, domainLeft, domainBottom, title }: Props = $props();

	let options: LineChartOptions = {
		title,
		axes: {
			bottom: {
				domain: domainBottom,
				mapsTo: "key",
				title: "Dates",
				scaleType: ScaleTypes.LABELS
			},
			left: {
				domain: domainLeft,
				mapsTo: "value",
				title: "Prices (PHP)",
				scaleType: ScaleTypes.LINEAR
			}
		},
		height: "400px"
	};
</script>

<LineChart {data} {options} style="padding:2rem;" />
