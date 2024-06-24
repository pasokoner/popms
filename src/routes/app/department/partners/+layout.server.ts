import { superValidate } from "sveltekit-superforms";
import type { LayoutServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { createPartnerSchema, editPartnerSchema } from "$lib/zod-schemas";

export const load: LayoutServerLoad = async () => {
	const [createPartnerForm, editPartnerForm] = await Promise.all([
		superValidate(zod(createPartnerSchema)),
		superValidate(zod(editPartnerSchema))
	]);

	return {
		createPartnerForm,
		editPartnerForm
	};
};
