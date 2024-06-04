import { priceChangeRequestAction } from "$lib/server/partnerProducts";
import {
	getPendingProductByPartnerId,
	getProductsByDepartmentId,
	getTrackedProductByPartnerId
} from "$lib/server/products";
import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { priceChangeRequestSchema } from "$lib/zod-schemas";

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent();

	return {
		trackedProducts: await getTrackedProductByPartnerId(user.groupId),
		pendingProducts: await getPendingProductByPartnerId(user.groupId),
		products: await getProductsByDepartmentId(user.departmentId),
		priceChangeRequestForm: await superValidate(zod(priceChangeRequestSchema))
	};
};

export const actions: Actions = {
	priceChangeRequest: priceChangeRequestAction
};
