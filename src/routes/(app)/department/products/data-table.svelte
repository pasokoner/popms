<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
	import { writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import DataTableActions from "./data-actions.svelte";
	import type { Product } from "$lib/server/db/schema.ts";

	let { data = [] }: { data: Product[] } = $props();

	const products = writable(data);

	const table = createTable(products);

	const columns = table.createColumns([
		table.column({
			accessor: "name",
			header: "Name"
		}),
		table.column({
			accessor: "unit",
			header: "Unit"
		}),
		table.column({
			accessor: "updatedAt",
			header: "Updated At"
		}),
		table.column({
			accessor: (product) => product,
			header: "Action",
			cell: ({ value }) => {
				return createRender(DataTableActions, { product: value });
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);

	$effect(() => {
		$products = data;
	});
</script>

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
