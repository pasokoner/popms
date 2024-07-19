<script lang="ts">
	import DataTable from "./data-table.svelte";
	import DepartmentCreateSheetForm from "./department-create-sheet-form.svelte";

	let { data } = $props();
</script>

<div class="space-y-5">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-medium">Departments</h2>
	</div>
	<DataTable data={data.departmentWithOwner} createDepartmentForm={data.createDepartmentForm} />
</div>
