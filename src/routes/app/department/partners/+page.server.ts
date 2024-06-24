import { getDepartmentWithPartnersByOwnerId } from "$lib/server/departments";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { createPartnerAction, editPartnerAction } from "$lib/server/partners";

export const load: PageServerLoad = async (event) => {
	const { user } = event.locals;
	if (!user) redirect(302, "/login");

	const department = await getDepartmentWithPartnersByOwnerId(user.id);
	if (!department) error(404, "Department not found");

	return {
		department
	};
};

export const actions: Actions = {
	createPartner: createPartnerAction,
	editPartner: editPartnerAction
};
