<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
	import { writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import DataTableActions from "./pcr-data-actions.svelte";
	import type { PartnerProduct, Product } from "$lib/server/db/schema.ts";
	import { format } from "date-fns";
	import { page } from "$app/stores";

	let { data = [] }: { data: (PartnerProduct & { product: Product })[] } = $props();

	const products = writable(data);

	const table = createTable(products);

	const columns = table.createColumns([
		table.column({
			accessor: ({ product }) => product.name,
			header: "Name"
		}),
		table.column({
			accessor: "price",
			header: "Price"
		}),
		table.column({
			accessor: ({ product }) => product.unit,
			header: "Unit"
		}),
		table.column({
			accessor: "createdAt",
			header: "Date",
			cell: ({ value }) => {
				return format(new Date(value), "MM/dd/yyyy");
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
