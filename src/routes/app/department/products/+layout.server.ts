import { superValidate } from "sveltekit-superforms";
import type { LayoutServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { createProductSchema, editProductSchema } from "$lib/zod-schemas";

export const load: LayoutServerLoad = async () => {
	const [createProductForm, editProductForm] = await Promise.all([
		superValidate(zod(createProductSchema)),
		superValidate(zod(editProductSchema))
	]);

	return {
		createProductForm,
		editProductForm
	};
};
