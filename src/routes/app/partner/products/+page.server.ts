import { priceChangeRequestAction } from "$lib/server/router/partner-products";
import {
	deleteRequestAction,
	getPartnerPendingProducts,
	getDepartmentProducts,
	getPartnerTrackedProducts
} from "$lib/server/router/product";
import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { deleteRequestSchema, priceChangeRequestSchema } from "$lib/zod-schemas";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent();

	const { partnerId, departmentId } = user;

	if (!partnerId) redirect(302, "/app/partner/products");

	return {
		trackedProducts: await getPartnerTrackedProducts(partnerId),
		pendingProducts: await getPartnerPendingProducts(partnerId),
		products: await getDepartmentProducts(departmentId),
		priceChangeRequestForm: await superValidate(zod(priceChangeRequestSchema)),
		deleteRequestForm: await superValidate(zod(deleteRequestSchema))
	};
};

export const actions: Actions = {
	priceChangeRequest: priceChangeRequestAction,
	deleteRequest: deleteRequestAction
};
