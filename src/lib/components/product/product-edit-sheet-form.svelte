<script lang="ts">
	import { cn } from "$lib/utils";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Input } from "$lib/components/ui/input";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import * as Sheet from "$lib/components/ui/sheet";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { ChevronRightIcon, LoaderCircleIcon } from "lucide-svelte";
	import * as Form from "$lib/components/ui/form";

	import { editProductSchema, type EditProductSchema } from "$lib/zod-schemas";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";
	import type { Product } from "$lib/server/db/schema";

	let {
		product,
		theForm
	}: {
		theForm: SuperValidated<Infer<EditProductSchema>>;
		product: Product;
	} = $props();

	let open = $state(false);

	const form = superForm(theForm, {
		validators: zodClient(editProductSchema),
		id: `edit-product-${product.id}`,
		resetForm: false,
		onUpdate(event) {
			if (event.form.valid) {
				open = false;
				toast.success("Save successfully", {
					position: "top-center"
				});
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	$effect(() => {
		$formData = { ...product, quantity: String(product.quantity), productId: product.id };
	});
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger
		class={cn(buttonVariants({ variant: "link" }), "gap-x-2 p-0 text-sm text-emerald-500")}
	>
		Edit <ChevronRightIcon class="size-3.5" />
	</Sheet.Trigger>
	<Sheet.Content class="flex min-h-screen flex-col sm:max-w-lg">
		<Sheet.Header>
			<Sheet.Title>Edit Product</Sheet.Title>
		</Sheet.Header>

		<Separator />

		<form use:enhance method="POST" action="?/editProduct" class="flex-1 overflow-y-auto px-2">
			<Form.Field {form} name="productId">
				<Form.Control let:attrs>
					<Input {...attrs} class="sr-only" bind:value={$formData.productId} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input {...attrs} bind:value={$formData.name} placeholder="Ex. Red Canned Goods" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="grid grid-cols-2 gap-x-2">
				<Form.Field {form} name="quantity">
					<Form.Control let:attrs>
						<Form.Label>Quantity</Form.Label>
						<Input {...attrs} bind:value={$formData.quantity} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="unit">
					<Form.Control let:attrs>
						<Form.Label>Unit</Form.Label>
						<Input {...attrs} bind:value={$formData.unit} placeholder="Ex. kg, pcs, g, ml, L" />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		</form>

		<Separator />

		<Sheet.Footer class="gap-y-2 sm:justify-between">
			<Sheet.Close asChild let:builder>
				<Button
					builders={[builder]}
					variant="outline"
					type="button"
					class="w-full"
					disabled={$submitting}
				>
					Cancel
				</Button>
			</Sheet.Close>
			<Button class="w-full" disabled={$submitting} onclick={() => form.submit()}>
				{#if $submitting}
					<LoaderCircleIcon class="h-5 w-5 animate-spin" />
				{:else}
					Save
				{/if}
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
