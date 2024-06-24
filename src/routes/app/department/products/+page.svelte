<script lang="ts">
	import ProductCreateModalForm from "$lib/components/product/product-create-modal-form.svelte";
	import DivWrapper from "$lib/components/div-wrapper.svelte";
	import DataTable from "./data-table.svelte";

	let { data } = $props();
</script>

<DivWrapper class="space-y-5">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-medium">Products</h2>

		<ProductCreateModalForm theForm={data.createProductForm} />
	</div>
	<DataTable data={data.department.products} />
</DivWrapper>
