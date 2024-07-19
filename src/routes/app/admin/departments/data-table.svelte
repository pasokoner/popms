<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
	import { readable, writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import DataTableActions from "./data-actions.svelte";
	import type { DepartmentWithOwner } from "$lib/server/db/schema.ts";
	import DepartmentCreateSheetForm from "./department-create-sheet-form.svelte";

	import { Input } from "$lib/components/ui/input";

	import { addTableFilter } from "svelte-headless-table/plugins";
	import type { Infer, SuperValidated } from "sveltekit-superforms";
	import type { CreateDepartmentSchema } from "$lib/zod-schemas";

	type Props = {
		data: DepartmentWithOwner[];
		createDepartmentForm: SuperValidated<Infer<CreateDepartmentSchema>>;
	};

	let { data, createDepartmentForm }: Props = $props();

	const departments = writable(data);

	const table = createTable(readable(data), {
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: "name",
			header: "Name"
		}),
		table.column({
			accessor: (department) => department.owner.email,
			id: "ownerEmail",
			header: "Email"
		}),
		table.column({
			accessor: "updatedAt",
			header: "Updated At",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: "Action",
			plugins: {
				filter: {
					exclude: true
				}
			},
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value });
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;

	$effect(() => {
		$departments = data;
	});
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between gap-x-2">
		<Input class="max-w-xs" placeholder="Search..." type="text" bind:value={$filterValue} />

		<DepartmentCreateSheetForm data={createDepartmentForm} />
	</div>

	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
