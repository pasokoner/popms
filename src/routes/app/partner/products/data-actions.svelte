<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import type { Product } from "$lib/server/db/schema";
	import { cn } from "$lib/utils";
	import { LoaderCircleIcon } from "lucide-svelte";
	import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { type PriceChangeRequestSchema, priceChangeRequestSchema } from "$lib/zod-schemas";
	import { toast } from "svelte-sonner";
	import Input from "$lib/components/ui/input/input.svelte";
	import { ChevronRightIcon } from "lucide-svelte/icons";

	type Props = {
		product: Product;
		price: string;
		pending: boolean;
		theForm: SuperValidated<Infer<PriceChangeRequestSchema>>;
	};

	let { price, product, theForm, pending }: Props = $props();

	let open = $state(false);

	const form = superForm(theForm, {
		validators: zodClient(priceChangeRequestSchema),
		dataType: "json",
		onUpdate(event) {
			if (!event.form.valid) {
				toast.error(event.form.errors._errors?.[0] || "Something went wrong!", {
					position: "top-center"
				});
				return;
			}

			open = false;

			toast.success("Request sent!", {
				position: "top-center"
			});
		}
	});

	const { form: formData, enhance, submit, submitting } = form;

	let priceTo = $state(price);

	$effect(() => {
		$formData.products = [
			{
				productId: product.id,
				price: priceTo
			}
		];
	});
</script>

{#if !pending}
	<Dialog.Root bind:open>
		<Dialog.Trigger
			class={cn(
				buttonVariants({
					variant: "outline",
					size: "sm"
				}),
				"h-7 text-xs"
			)}
		>
			request
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title class="text-2xl">{product.name}</Dialog.Title>
				<form use:enhance method="POST" action="?/priceChangeRequest" class="space-y-4">
					<div class="grid h-16 grid-cols-10 gap-x-5">
						<div class="col-span-4 flex h-full flex-col items-center justify-center text-lg">
							{price}
						</div>

						<div class="col-span-2 flex flex-col items-center justify-center">
							<ChevronRightIcon class="size-10" />
						</div>

						<Input
							type="text"
							class={cn(
								"col-span-4 h-full text-center text-lg",
								priceTo > price ? "text-red-500" : priceTo === price ? "" : "text-green-500"
							)}
							bind:value={priceTo}
						/>
					</div>

					<div class="grid w-full grid-cols-2 gap-x-2">
						<Button disabled={$submitting} variant="outline" onclick={() => (open = false)}
							>Cancel</Button
						>
						<Button disabled={$submitting} onclick={() => submit()}>
							{#if $submitting}
								<LoaderCircleIcon class="h-5 w-5 animate-spin" />
							{:else}
								Submit
							{/if}
						</Button>
					</div>
				</form>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
{/if}
