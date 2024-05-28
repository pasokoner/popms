<script lang="ts">
	import ProductEditSheetForm from "$lib/components/product/product-edit-sheet-form.svelte";
	import type { Product } from "$lib/server/db/schema";
	import { page } from "$app/stores";

	let { product }: { product: Product } = $props();
</script>

<ProductEditSheetForm {product} theForm={$page.data.editProductForm} />
