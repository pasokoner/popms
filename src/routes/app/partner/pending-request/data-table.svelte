<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
	import { writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import DataTableActions from "./data-actions.svelte";
	import type { PartnerProduct, Product } from "$lib/server/db/schema";
	import { format } from "date-fns";

	import { Input } from "$lib/components/ui/input";

	import { addTableFilter } from "svelte-headless-table/plugins";

	import { page } from "$app/stores";

	type Props = {
		data: (PartnerProduct & {
			product: Product;
		})[];
	};

	let { data = [] }: Props = $props();

	const pendingProducts = writable(data);

	const table = createTable(pendingProducts, {
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: ({ product }) => product.name,
			header: "Product Name"
		}),
		table.column({
			accessor: ({ product }) => product.unit,
			header: "Product Unit"
		}),
		table.column({
			accessor: "price",
			header: "Price"
		}),
		table.column({
			accessor: "updatedAt",
			header: "Last update",
			plugins: {
				filter: {
					exclude: true
				}
			},
			cell: ({ value }) => {
				return format(new Date(value), "yyyy-MM-dd");
			}
		}),
		table.column({
			accessor: "id",
			header: "",
			cell: ({ value }) => {
				return createRender(DataTableActions, {
					partnerProductId: value,
					deleteRequestForm: $page.data.deleteRequestForm
				});
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;

	$effect(() => {
		$pendingProducts = data;
	});
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between gap-x-2">
		<Input class="max-w-xs" placeholder="Search..." type="text" bind:value={$filterValue} />
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
