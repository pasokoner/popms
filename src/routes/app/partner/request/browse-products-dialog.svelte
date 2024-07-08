<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import Input from "$lib/components/ui/input/input.svelte";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import type { PartnerProduct, Product } from "$lib/server/db/schema";
	import { cn } from "$lib/utils";
	import { LoaderCircleIcon, XIcon } from "lucide-svelte";
	import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { type PriceChangeRequestSchema, priceChangeRequestSchema } from "$lib/zod-schemas";
	import { toast } from "svelte-sonner";
	import { Badge } from "$lib/components/ui/badge";

	let {
		products,
		pendingProducts,
		theForm
	}: {
		products: Product[];
		pendingProducts: PartnerProduct[];
		trackedProducts: PartnerProduct[];
		theForm: SuperValidated<Infer<PriceChangeRequestSchema>>;
	} = $props();

	let open = $state(false);

	let pendingProductIds = $derived(pendingProducts.map((v) => v.productId));

	let formProducts: (Product & {
		price: string;
	})[] = $state(
		products.map((v) => ({
			...v,
			price: "0"
		}))
	);

	let displayProducts = $derived.by(() => {
		const filtered = formProducts.filter((v) => !isNaN(Number(v.price)) && Number(v.price) !== 0);

		return filtered;
	});

	function removeFromFormProducts(id: string) {
		const idx = formProducts.findIndex((v) => v.id === id);
		formProducts[idx].price = "0";
	}

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

			formProducts = formProducts.map((v) => ({
				...v,
				price: "0"
			}));

			open = false;

			toast.success("Request sent!", {
				position: "top-center"
			});
		}
	});

	const { form: formData, enhance, submit, submitting, errors } = form;

	$effect(() => {
		$formData.products = displayProducts.map((v) => ({
			price: v.price,
			productId: v.id
		}));
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={cn(
			buttonVariants({
				variant: "outline"
			}),
			"gap-x-2"
		)}
	>
		Browse
	</Dialog.Trigger>
	<Dialog.Content class="max-w-7xl p-8">
		<Dialog.Header>
			<div class="grid grid-cols-2 gap-x-4">
				<div class="flex h-[520px] flex-col gap-y-2">
					<ScrollArea class="flex-1 rounded-md border p-4">
						<div class="space-y-4">
							{#each products.map( (v) => ({ ...v, isPending: pendingProductIds.includes(v.id) }) ) as p, i (p.id)}
								<div class="flex items-center gap-x-2 text-sm">
									<div class="flex-1 space-y-1 text-gray-500">
										<div>
											{p.name} /
											<span class="font-semibold">
												{p.unit}
											</span>
										</div>
										{#if p.isPending}
											<Badge class="bg-orange-400 py-0 text-[10px]">pending</Badge>
										{/if}
									</div>
									<Input
										type="text"
										disabled={p.isPending}
										class="w-16 text-xs"
										bind:value={formProducts[i].price}
									/>
								</div>
							{/each}
						</div>
					</ScrollArea>
				</div>
				<div class="flex flex-col space-y-2">
					<p class="text-center text-xl font-semibold">PRICE REQUEST FORM</p>

					<ScrollArea class="flex-1 p-4">
						<form use:enhance method="POST" action="?/priceChangeRequest" class="space-y-4">
							{#each displayProducts as p, i (p.id)}
								<div class="flex items-center gap-x-2 border-b pb-4 text-sm">
									<XIcon
										class="size-4 cursor-pointer text-red-500"
										onclick={() => removeFromFormProducts(p.id)}
									/>

									<div class="flex-1">
										{p.name} /
										<span class="font-semibold">
											{p.unit}
										</span>
									</div>
									<div>
										{p.price.split(".")[0]}.{p.price.split(".")[1] ? p.price.split(".")[1] : "00"}
									</div>
								</div>
							{/each}
						</form>
					</ScrollArea>

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
				</div>
			</div>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
