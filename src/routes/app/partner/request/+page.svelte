<script lang="ts">
	import DivWrapper from "$lib/components/div-wrapper.svelte";
	import PartnerCreateSheetForm from "$lib/components/partner/partner-create-sheet-form.svelte";
	import BrowseProductsDialog from "./browse-products-dialog.svelte";
	import DataTable from "./data-table.svelte";
	import PCRDataTable from "./pcr-data-table.svelte";

	let { data } = $props();

	$inspect(data.trackedProducts);
	$inspect(data.pendingProducts);
</script>

<div class="space-y-10">
	<DivWrapper class="space-y-5">
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-medium">Tracked Products</h2>

			<BrowseProductsDialog
				trackedProducts={data.trackedProducts}
				pendingProducts={data.pendingProducts}
				products={data.products}
				theForm={data.priceChangeRequestForm}
			/>
		</div>
		<DataTable data={[]} />
	</DivWrapper>

	<DivWrapper class="space-y-5">
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-medium">Price Request</h2>
		</div>
		<PCRDataTable data={data.pendingProducts} />
	</DivWrapper>
</div>
