<script lang="ts">
	import PartnerEditSheetForm from "./partnet-edit-sheet-form.svelte";
	import type { PartnerWithUser } from "$lib/server/db/schema";
	import { page } from "$app/stores";

	let { partner }: { partner: PartnerWithUser } = $props();
</script>

<PartnerEditSheetForm {partner} theForm={$page.data.editPartnerForm} />
