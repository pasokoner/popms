<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
	import { addPagination } from "svelte-headless-table/plugins";
	import { writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import { Button } from "$lib/components/ui/button";

	import DataTableActions from "./data-actions.svelte";
	import type { PartnerProduct, Partner } from "$lib/server/db/schema.ts";

	let { data = [] }: { data: (Partner & { partnerProducts: PartnerProduct[] })[] } = $props();

	const products = writable(data);

	const table = createTable(products, {
		page: addPagination()
	});

	const columns = table.createColumns([
		table.column({
			accessor: "name",
			header: "Name"
		}),
		table.column({
			accessor: (product) => product,
			header: "Latest Price",
			cell: ({ value }) => {
				return value.partnerProducts.length > 0 ? value.partnerProducts[0].price : "----";
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;

	$effect(() => {
		$products = data;
	});
</script>

<div>
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
	<div class="flex items-center justify-end space-x-4 py-4">
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div>
</div>
