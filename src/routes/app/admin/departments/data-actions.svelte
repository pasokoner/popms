<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Dialog from "$lib/components/ui/dialog";

	import { PencilIcon } from "lucide-svelte";

	let { id }: { id: string } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
		<PencilIcon class="size-4" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
