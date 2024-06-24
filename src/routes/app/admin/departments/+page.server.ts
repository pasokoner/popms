import { createDepartmentAction, getDepartmentWithOwner } from "$lib/server/departments";
import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { createDepartmentSchema } from "$lib/zod-schemas";

export const load: PageServerLoad = async () => {
	return {
		departmentWithOwner: await getDepartmentWithOwner(),
		createDepartmentForm: await superValidate(zod(createDepartmentSchema))
	};
};

export const actions: Actions = {
	createDepartment: createDepartmentAction
};
