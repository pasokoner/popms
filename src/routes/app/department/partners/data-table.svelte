<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
	import { writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import DataTableActions from "./data-actions.svelte";
	import type { PartnerWithUser } from "$lib/server/db/schema";
	import { format } from "date-fns";

	import PartnerCreateSheetForm from "./partner-create-sheet-form.svelte";
	import { Input } from "$lib/components/ui/input";

	import { addTableFilter } from "svelte-headless-table/plugins";
	import type { CreatePartnerSchema } from "$lib/zod-schemas";
	import type { Infer, SuperValidated } from "sveltekit-superforms";

	type Props = {
		data: PartnerWithUser[];
		createPartnerForm: SuperValidated<Infer<CreatePartnerSchema>>;
	};

	let { data = [], createPartnerForm }: Props = $props();

	const partners = writable(data);

	const table = createTable(partners, {
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
			accessor: (partner) => partner.user.email,
			id: "email",
			header: "Email"
		}),
		table.column({
			accessor: "updatedAt",
			header: "Updated At",
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
			accessor: (partner) => partner,
			header: "Action",
			plugins: {
				filter: {
					exclude: true
				}
			},
			cell: ({ value }) => {
				return createRender(DataTableActions, { partner: value });
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;

	$effect(() => {
		$partners = data;
	});
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between gap-x-2">
		<Input class="max-w-xs" placeholder="Search..." type="text" bind:value={$filterValue} />

		<PartnerCreateSheetForm theForm={createPartnerForm} />
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
