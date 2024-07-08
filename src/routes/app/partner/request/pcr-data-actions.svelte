<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import Button from "$lib/components/ui/button/button.svelte";
	import { deleteRequestSchema, type DeleteRequestSchema } from "$lib/zod-schemas";
	import { LoaderIcon, XIcon } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	let {
		partnerProductId,
		deleteRequestForm
	}: {
		partnerProductId: string;
		deleteRequestForm: SuperValidated<Infer<DeleteRequestSchema>>;
	} = $props();

	const deleteForm = superForm(deleteRequestForm, {
		id: `delete-form-${partnerProductId}`,
		validators: zodClient(deleteRequestSchema),
		dataType: "json",
		onUpdated: async (event) => {
			if (event.form.errors._errors?.[0]) {
				toast.error(event.form.errors._errors[0]);
				return;
			}
			await invalidateAll();
		}
	});

	const { enhance: deleteEnhance, form: deleteFormData, submitting: deleteSubmitting } = deleteForm;

	$effect(() => {
		$deleteFormData.partnerProductId = partnerProductId;
	});
</script>

<div class="flex items-center gap-x-2">
	<form method="POST" action="?/deleteRequest" use:deleteEnhance>
		<Button
			size="icon"
			class="rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white focus-visible:bg-red-500 focus-visible:text-white"
			type="submit"
			disabled={$deleteSubmitting}
		>
			{#if $deleteSubmitting}
				<LoaderIcon class="size-7 animate-spin p-1" />
			{:else}
				<XIcon class="size-7 p-1" />
			{/if}
		</Button>
	</form>
</div>
