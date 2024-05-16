<script lang="ts">
	import { cn } from "$lib/utils";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import * as Sheet from "$lib/components/ui/sheet";

	import { LoaderCircleIcon, PlusIcon } from "lucide-svelte";
	import { buttonVariants } from "./ui/button";

	import { createDepartmentSchema, type CreateDepartmentSchema } from "$lib/zod-schemas";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	let {
		data
	}: {
		data: SuperValidated<Infer<CreateDepartmentSchema>>;
	} = $props();

	const form = superForm(data, {
		validators: zodClient(createDepartmentSchema)
	});

	const { form: formData, enhance, submitting } = form;
</script>

<Sheet.Root>
	<Sheet.Trigger class={cn(buttonVariants(), "gap-x-2")}>
		<PlusIcon class="size-4" /> <span class="hidden sm:block">Add Department</span>
	</Sheet.Trigger>
	<Sheet.Content class="flex min-h-screen flex-col sm:max-w-lg">
		<Sheet.Header>
			<Sheet.Title>Add Department</Sheet.Title>
		</Sheet.Header>

		<Separator />
		<form method="POST" action="?/createDepartment" use:enhance class="flex-1">
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
					Submit
				{/if}
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
