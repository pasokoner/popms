<script lang="ts">
	import DivWrapper from "$lib/components/div-wrapper.svelte";
	import DataTable from "./data-table.svelte";

	let { data } = $props();

	$inspect(data.trackedProducts);
	$inspect(data.pendingProducts);
</script>

<DivWrapper class="space-y-5">
	<h2 class="text-xl font-medium">Pending Products</h2>

	<DataTable
		data={data.trackedProducts}
		pendingProducts={data.pendingProducts}
		products={data.products}
	/>
</DivWrapper>
