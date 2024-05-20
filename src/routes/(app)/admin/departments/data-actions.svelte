<script lang="ts">
	import DepartmentEditSheetForm from "$lib/components/department-edit-sheet-form.svelte";

	let { id }: { id: string } = $props();
</script>

<DepartmentEditSheetForm {id} />
