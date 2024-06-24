<script lang="ts">
	import DivWrapper from "$lib/components/div-wrapper.svelte";
	import PartnerCreateSheetForm from "$lib/components/partner/partner-create-sheet-form.svelte";
	import DataTable from "./data-table.svelte";

	let { data } = $props();
</script>

<DivWrapper class="space-y-5">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-medium">Partners</h2>

		<PartnerCreateSheetForm data={data.createPartnerForm} />
	</div>
	<DataTable data={data.department.partners} />
</DivWrapper>
