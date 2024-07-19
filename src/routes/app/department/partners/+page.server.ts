import { getDepartmentPartners } from "$lib/server/router/department";
import { createPartnerAction, editPartnerAction } from "$lib/server/router/partner";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { createPartnerSchema, editPartnerSchema } from "$lib/zod-schemas";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async (event) => {
	const { user } = event.locals;
	if (!user) redirect(302, "/login");

	const department = await getDepartmentPartners(user.id);
	if (!department) error(404, "Department not found");

	return {
		department,
		createPartnerForm: await superValidate(zod(createPartnerSchema)),
		editPartnerForm: await superValidate(zod(editPartnerSchema))
	};
};

export const actions: Actions = {
	createPartner: createPartnerAction,
	editPartner: editPartnerAction
};
