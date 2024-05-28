<script lang="ts">
	import { cn } from "$lib/utils";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Input } from "$lib/components/ui/input";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import * as Sheet from "$lib/components/ui/sheet";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { LoaderCircleIcon, PlusIcon } from "lucide-svelte";
	import * as Form from "$lib/components/ui/form";

	import { createProductSchema, type CreateProductSchema } from "$lib/zod-schemas";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";

	let {
		theForm
	}: {
		theForm: SuperValidated<Infer<CreateProductSchema>>;
	} = $props();

	let open = $state(false);

	const form = superForm(theForm, {
		validators: zodClient(createProductSchema),
		dataType: "json",
		onUpdate(event) {
			if (event.form.valid) {
				open = false;
				toast.success("New product/s created", {
					position: "top-center"
				});
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	function removeProductByIndex(index: number) {
		$formData.products = $formData.products.filter((_, i) => i !== index);
	}

	function addProduct() {
		$formData.products = [
			...$formData.products,
			{
				name: "",
				unit: ""
			}
		];
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class={cn(buttonVariants(), "gap-x-2")}>
		<PlusIcon class="size-4" /> <span class="hidden sm:block">Add Product</span>
	</Sheet.Trigger>
	<Sheet.Content class="flex min-h-screen flex-col sm:max-w-lg">
		<Sheet.Header>
			<Sheet.Title>Add Product</Sheet.Title>
		</Sheet.Header>

		<Separator />
		<form use:enhance method="POST" action="?/createProduct" class="flex-1 overflow-y-auto px-2">
			<Form.Fieldset {form} name="products" class="space-y-2">
				{#each $formData.products as _, i}
					<div class="space-y-1">
						<div class="text-sm">Product {i + 1}</div>

						<Form.ElementField {form} name="products[{i}].name">
							<Form.Control let:attrs>
								<Form.Label>Name</Form.Label>
								<Input
									{...attrs}
									bind:value={$formData.products[i].name}
									placeholder="Ex. Red Canned Goods"
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.ElementField>

						<Form.ElementField {form} name="products[{i}].unit">
							<Form.Control let:attrs>
								<Form.Label>Unit</Form.Label>
								<Input
									{...attrs}
									bind:value={$formData.products[i].unit}
									placeholder="Ex. kg, pcs, g, ml, L"
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.ElementField>

						<Button
							variant="destructive"
							onclick={() => removeProductByIndex(i)}
							class="h-8 w-full text-xs"
						>
							Remove
						</Button>
					</div>
				{/each}
				<Form.FieldErrors />
			</Form.Fieldset>
		</form>

		<div class="space-y-4">
			<Button type="button" variant="outline" size="sm" onclick={addProduct} class="w-full">
				<PlusIcon class="stroke-1" />
			</Button>

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
						Submit
					{/if}
				</Button>
			</Sheet.Footer>
		</div>
	</Sheet.Content>
</Sheet.Root>
