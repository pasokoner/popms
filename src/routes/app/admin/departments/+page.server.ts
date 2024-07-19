import { createDepartmentAction, getDepartmentWithOwner } from "$lib/server/router/department";
import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { createDepartmentSchema } from "$lib/zod-schemas";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/login");

	return {
		departmentWithOwner: await getDepartmentWithOwner(),
		createDepartmentForm: await superValidate(zod(createDepartmentSchema))
	};
};

export const actions: Actions = {
	createDepartment: createDepartmentAction
};
