<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
	import { writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import DataTableActions from "./data-actions.svelte";
	import type { Partner, PartnerProduct, Product } from "$lib/server/db/schema.ts";
	import { Input } from "$lib/components/ui/input";
	import { addTableFilter } from "svelte-headless-table/plugins";
	import { page } from "$app/stores";

	let {
		data = []
	}: { data: (PartnerProduct & { product?: Product | null; partner?: Partner | null })[] } =
		$props();

	const products = writable(data);

	const table = createTable(products, {
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: ({ product }) => product?.name || "",
			header: "Name"
		}),
		table.column({
			accessor: ({ partner }) => partner?.name || "",
			header: "Partner"
		}),
		table.column({
			accessor: "price",
			header: "New Price",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ product }) => product?.unit || "",
			header: "Unit",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "createdAt",
			header: "Request Date",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "id",
			header: "Action",
			cell: ({ value }) => {
				return createRender(DataTableActions, {
					partnerProductId: value,
					rejectRequestForm: $page.data.rejectRequestForm,
					acceptRequestForm: $page.data.acceptRequestForm
				});
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;

	$effect(() => {
		$products = data;
	});
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between gap-x-2">
		<Input class="max-w-xs" placeholder="Search..." type="text" bind:value={$filterValue} />

		<!-- <ProductCreateSheetForm theForm={createProductForm} /> -->
	</div>

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
