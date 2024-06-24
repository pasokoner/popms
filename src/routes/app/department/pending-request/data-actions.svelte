<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import Button from "$lib/components/ui/button/button.svelte";
	import {
		acceptRequestSchema,
		rejectRequestSchema,
		type AcceptRequestSchema,
		type RejectRequestSchema
	} from "$lib/zod-schemas";
	import { CheckIcon, LoaderIcon, XIcon } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	let {
		partnerProductId,
		rejectRequestForm,
		acceptRequestForm
	}: {
		partnerProductId: string;
		rejectRequestForm: SuperValidated<Infer<RejectRequestSchema>>;
		acceptRequestForm: SuperValidated<Infer<AcceptRequestSchema>>;
	} = $props();

	const rejectForm = superForm(rejectRequestForm, {
		id: `reject-form-${partnerProductId}`,
		validators: zodClient(rejectRequestSchema),
		dataType: "json",
		onUpdated: async (event) => {
			if (event.form.errors._errors?.[0]) {
				toast.error(event.form.errors._errors[0]);
				return;
			}
			await invalidateAll();
		}
	});

	const acceptForm = superForm(acceptRequestForm, {
		id: `accept-form-${partnerProductId}`,
		validators: zodClient(acceptRequestSchema),
		dataType: "json",
		onUpdated: async (event) => {
			if (event.form.errors._errors?.[0]) {
				toast.error(event.form.errors._errors[0]);
				return;
			}
			await invalidateAll();
		}
	});

	const { enhance: rejectEnhance, form: rejectFormData, submitting: rejectSubmitting } = rejectForm;
	const { enhance: acceptEnhance, form: acceptFormData, submitting: acceptSubmitting } = acceptForm;

	$effect(() => {
		$rejectFormData.partnerProductId = partnerProductId;
		$acceptFormData.partnerProductId = partnerProductId;
	});
</script>

<div class="flex items-center gap-x-2">
	<form method="POST" action="?/rejectRequest" use:rejectEnhance>
		<Button
			size="icon"
			class="rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white focus-visible:bg-red-500 focus-visible:text-white"
			type="submit"
			disabled={$rejectSubmitting || $acceptSubmitting}
		>
			{#if $rejectSubmitting}
				<LoaderIcon class="size-7 animate-spin p-1" />
			{:else}
				<XIcon class="size-7 p-1" />
			{/if}
		</Button>
	</form>

	<form method="POST" action="?/acceptRequest" use:acceptEnhance>
		<Button
			size="icon"
			class="rounded-full bg-white text-green-500 hover:bg-green-500 hover:text-white focus-visible:bg-green-500 focus-visible:text-white"
			type="submit"
			disabled={$acceptSubmitting || $rejectSubmitting}
		>
			{#if $acceptSubmitting}
				<LoaderIcon class="size-7 animate-spin p-1" />
			{:else}
				<CheckIcon class="size-7 p-1" />
			{/if}
		</Button>
	</form>
</div>
