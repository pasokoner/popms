import {
	acceptRequestAction,
	getPendingProductsByDepartmentId,
	rejectRequestAction
} from "$lib/server/products";
import { superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { acceptRequestSchema, rejectRequestSchema } from "$lib/zod-schemas";

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent();

	return {
		pendingProducts: await getPendingProductsByDepartmentId(user.departmentId),
		rejectRequestForm: await superValidate(zod(rejectRequestSchema)),
		acceptRequestForm: await superValidate(zod(acceptRequestSchema))
	};
};

export const actions: Actions = {
	rejectRequest: rejectRequestAction,
	acceptRequest: acceptRequestAction
};
