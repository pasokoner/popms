import db from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getLatestPrices } from "$lib/server/router/product";

export const load: PageServerLoad = async ({ params }) => {
	const { productId } = params;

	const product = await db.query.product.findFirst({
		where: (product, { eq }) => eq(product.id, productId)
	});

	if (!product) error(404, "Product not found");

	return {
		product,
		// partners: await db.query.partner.findMany({
		// 	where: (partner, { eq }) => eq(partner.departmentId, product.departmentId),

		// 	with: {
		// 		partnerProducts: {
		// 			where: (partnerProduct, { eq, and }) =>
		// 				and(eq(partnerProduct.status, "accepted"), eq(partnerProduct.productId, productId)),
		// 			orderBy: (partnerProduct, { asc }) => asc(partnerProduct.createdAt)
		// 		}
		// 	},
		// 	orderBy: (partner, { asc }) => asc(partner.name)
		// }),
		// chartData: await db.query.partner.findFirst({
		// 	where: (partner, { eq }) => (partnerQuery ? eq(partner.name, partnerQuery) : undefined),
		// 	with: {
		// 		partnerProducts: {
		// 			where: (partnerProduct, { eq, and }) =>
		// 				and(eq(partnerProduct.status, "accepted"), eq(partnerProduct.productId, productId)),
		// 			orderBy: (partnerProduct, { asc }) => asc(partnerProduct.createdAt)
		// 		}
		// 	}
		// }),
		latestPrices: await getLatestPrices(product.id, product.departmentId)
	};
};
