<script lang="ts">
	import DepartmentCreateSheetForm from "$lib/components/department-create-sheet-form.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import DataTable from "./data-table.svelte";

	let { data } = $props();

	$inspect(data.departmentWithOwner);
</script>

<div class="space-y-5">
	<div class="flex items-center justify-between">
		<h2 class="font-medium">Departments</h2>

		<DepartmentCreateSheetForm data={data.createDepartmentForm} />
	</div>
	<DataTable data={data.departmentWithOwner} />
</div>
