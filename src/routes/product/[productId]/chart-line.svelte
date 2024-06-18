<script lang="ts">
	import Chart, { type ChartData } from "chart.js/auto";

	let canvas = $state() as HTMLCanvasElement;

	let {
		datasets,
		labels
	}: {
		labels: string[];
		datasets: {
			label: string;
			data: number | string[];
		}[];
	} = $props();

	$effect(() => {
		new Chart(canvas, {
			type: "line",
			data: {
				labels,
				datasets
			},
			options: {
				indexAxis: "x",
				borderColor: "rgb(75, 192, 192)",
				responsive: true,
				maintainAspectRatio: false
			}
		});
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
