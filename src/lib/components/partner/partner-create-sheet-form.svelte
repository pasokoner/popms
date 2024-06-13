<script lang="ts">
	import { cn } from "$lib/utils";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import * as Select from "$lib/components/ui/select/index.js";

	import * as Sheet from "$lib/components/ui/sheet";

	import { LoaderCircleIcon, PlusIcon } from "lucide-svelte";
	import { buttonVariants } from "$lib/components/ui/button";

	import { createPartnerSchema, type CreatePartnerSchema } from "$lib/zod-schemas";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { MUNICIPALITIES } from "$lib/config";

	let {
		data
	}: {
		data: SuperValidated<Infer<CreatePartnerSchema>>;
	} = $props();

	// TODO: Find out why it errors
	// why the fck it errors when using dataType: "form"
	const form = superForm(data, {
		validators: zodClient(createPartnerSchema),
		dataType: "json"
	});

	const { form: formData, enhance, submitting, errors } = form;

	let selectedMunicipality = $derived(
		$formData.municipality
			? {
					label: $formData.municipality,
					value: $formData.municipality
				}
			: undefined
	);

	$effect(() => {
		console.log($formData.municipality, "FORM DATA");
	});
</script>

<Sheet.Root>
	<Sheet.Trigger class={cn(buttonVariants(), "gap-x-2")}>
		<PlusIcon class="size-4" /> <span class="hidden sm:block">Add Partner</span>
	</Sheet.Trigger>
	<Sheet.Content class="flex min-h-screen flex-col sm:max-w-lg">
		<Sheet.Header>
			<Sheet.Title>Add Partner</Sheet.Title>
		</Sheet.Header>

		<Separator />
		<form method="POST" action="?/createPartner" use:enhance class="flex-1">
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input {...attrs} bind:value={$formData.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="municipality">
				<Form.Control let:attrs>
					<Form.Label>Municipality</Form.Label>
					<Select.Root
						selected={selectedMunicipality}
						onSelectedChange={(v) => {
							console.log(v);
							v && ($formData.municipality = v.value);
						}}
					>
						<Select.Trigger {...attrs}>
							<Select.Value placeholder="Select municipality" />
						</Select.Trigger>
						<Select.Content>
							{#each MUNICIPALITIES as m}
								<Select.Item value={m} label={m} />
							{/each}
						</Select.Content>
					</Select.Root>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} bind:value={$formData.password} type="password" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			{JSON.stringify($errors._errors)}
		</form>

		<Separator />

		<Sheet.Footer class="gap-y-2 sm:justify-between">
			<Sheet.Close asChild let:builder>
				<Button
					builders={[builder]}
					variant="outline"
					type="submit"
					class="w-full"
					disabled={$submitting}>Cancel</Button
				>
			</Sheet.Close>
			<Button class="w-full" disabled={$submitting} onclick={() => form.submit()}>
				{#if $submitting}
					<LoaderCircleIcon class="h-5 w-5 animate-spin" />
				{:else}
					Submit
				{/if}
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
