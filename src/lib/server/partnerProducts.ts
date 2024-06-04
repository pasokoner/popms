import { priceChangeRequestSchema } from "$lib/zod-schemas";
import { error, redirect, type RequestEvent } from "@sveltejs/kit";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import db from "./db";
import { getUserDetails } from "./user";
import { partnerProduct } from "./db/schema";
import { eq, inArray, and } from "drizzle-orm";

export async function priceChangeRequestAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "partner") error(401);

	const form = await superValidate(event, zod(priceChangeRequestSchema));

	if (!form.valid) return fail(400, { form });

	const productIds = form.data.products.map((p) => p.productId);

	const hasPending = await db
		.select()
		.from(partnerProduct)
		.where(
			and(eq(partnerProduct.status, "pending"), inArray(partnerProduct.productId, productIds))
		);

	if (hasPending.length > 1) {
		return setError(form, "", "Some product have pending request");
	}

	const userDetails = await getUserDetails(event);

	const newRequest = form.data.products.map((v) => ({
		...v,
		partnerId: userDetails.groupId
	}));

	try {
		await db.insert(partnerProduct).values(newRequest);
	} catch (e) {
		return setError(form, "", "Something went wrong");
	}

	return { form };
}
