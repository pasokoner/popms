import { deleteRequestAction, getPartnerPendingProducts } from "$lib/server/router/product";
import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { deleteRequestSchema } from "$lib/zod-schemas";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent();

	const { partnerId } = user;

	if (!partnerId) redirect(302, "/app/partner/pending-request");

	return {
		pendingProducts: await getPartnerPendingProducts(partnerId),
		deleteRequestForm: await superValidate(zod(deleteRequestSchema))
	};
};

export const actions: Actions = {
	deleteRequest: deleteRequestAction
};
