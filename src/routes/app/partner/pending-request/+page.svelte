<script lang="ts">
	import DivWrapper from "$lib/components/div-wrapper.svelte";
	import DataTable from "./data-table.svelte";

	let { data } = $props();

	$inspect(data.pendingProducts);
</script>

<DivWrapper class="space-y-5">
	<h2 class="text-xl font-medium">Tracked Products</h2>

	<DataTable data={data.pendingProducts} />
</DivWrapper>
