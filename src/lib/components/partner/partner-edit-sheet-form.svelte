<script lang="ts">
	import { cn } from "$lib/utils";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import * as Sheet from "$lib/components/ui/sheet";

	import { ChevronRightIcon, LoaderCircleIcon } from "lucide-svelte";
	import { buttonVariants } from "$lib/components/ui/button";

	import { editPartnerSchema, type EditPartnerSchema } from "$lib/zod-schemas";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import type { PartnerWithUser } from "$lib/server/db/schema";
	import { toast } from "svelte-sonner";

	let {
		theForm,
		partner
	}: {
		theForm: SuperValidated<Infer<EditPartnerSchema>>;
		partner: PartnerWithUser;
	} = $props();

	let open = $state(false);

	const form = superForm(theForm, {
		validators: zodClient(editPartnerSchema),
		id: `edit-partner-${partner.id}`,
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
		$formData = {
			name: partner.name,
			email: partner.user.email,
			userId: partner.user.id
		};
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
			<Sheet.Title>Edit Partner</Sheet.Title>
		</Sheet.Header>

		<Separator />
		<form method="POST" action="?/editPartner" use:enhance class="flex-1">
			<Form.Field {form} name="userId">
				<Form.Control let:attrs>
					<Input {...attrs} class="sr-only" bind:value={$formData.userId} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input {...attrs} bind:value={$formData.name} />
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
					Save
				{/if}
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
