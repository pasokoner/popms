import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import {
	createProductAction,
	editProductAction,
	getDepartmentWithProducts
} from "$lib/server/router/product";

export const load: PageServerLoad = async (event) => {
	const { user } = event.locals;
	if (!user) redirect(302, "/login");

	const department = await getDepartmentWithProducts(user.id);
	if (!department) error(401, "UNAUTHORIZED");

	return {
		department
	};
};

export const actions: Actions = {
	createProduct: createProductAction,
	editProduct: editProductAction
};
