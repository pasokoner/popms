<script lang="ts">
	import DivWrapper from "$lib/components/div-wrapper.svelte";
	import DataTable from "./data-table.svelte";

	let { data } = $props();
</script>

<DivWrapper class="space-y-5">
	<div class="flex items-center justify-between rounded-sm">
		<h2 class="text-xl font-medium">Pending Request</h2>
	</div>

	<DataTable data={data.pendingProducts} />
</DivWrapper>
