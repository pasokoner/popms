<script lang="ts">
	import { LoaderIcon, UserRoundIcon } from "lucide-svelte";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { loginSchema } from "$lib/zod-schemas";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";

	let { data } = $props();

	const form = superForm(data.loginForm, {
		validators: zodClient(loginSchema),
		onUpdate(event) {
			if (!event.form.valid) {
				toast.error(event.form.errors._errors?.[0]!, {
					position: "top-center"
				});
			}
		}
	});

	const { form: formData, enhance, submitting } = form;
</script>

<main class="container flex max-w-md flex-1 flex-col gap-y-6 py-24">
	<div class="flex flex-col items-center gap-y-4">
		<div class="rounded-full border p-4">
			<div class="rounded-full border bg-white p-3.5">
				<UserRoundIcon class="size-7 text-gray-500" />
			</div>
		</div>
		<div class="text-center">
			<div class="text-2xl font-semibold">Login to your account</div>
			<div class="text-gray-600">Enter your details to login</div>
		</div>
	</div>
	<form method="POST" use:enhance class="w-full space-y-6">
		<div class="space-y-3">
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email Address</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<div class="space-y-3">
			<Form.Button class="w-full" disabled={$submitting}>
				{#if $submitting}
					<LoaderIcon class="mr-1 size-4 animate-spin" />
				{/if}
				Login
			</Form.Button>
		</div>
	</form>
</main>
