<script lang="ts">
	import DataTable from "./data-table.svelte";

	let { data } = $props();
</script>

<div class="space-y-5">
	<div class="flex items-center justify-between">
		<h2 class="font-medium">Pending Request</h2>
	</div>

	<DataTable data={data.pendingProducts} />
</div>
