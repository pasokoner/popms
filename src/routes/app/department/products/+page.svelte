<script lang="ts">
	import DivWrapper from "$lib/components/div-wrapper.svelte";
	import DataTable from "./data-table.svelte";

	let { data } = $props();
</script>

<DivWrapper class="space-y-5">
	<h2 class="text-xl font-medium">Products</h2>

	<DataTable data={data.department.products} createProductForm={data.createProductForm} />
</DivWrapper>
