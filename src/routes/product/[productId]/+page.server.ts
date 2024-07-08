import db from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getLatestAvgPrice } from "$lib/server/products";

export const load: PageServerLoad = async ({ params, url }) => {
	const { productId } = params;

	const partnerQuery = url.searchParams.get("partner");
	const q = url.searchParams.get("q");

	const product = await db.query.product.findFirst({
		where: (product, { eq }) => eq(product.id, productId)
	});

	if (!product) error(404, "Product not found");

	return {
		product,
		partners: await db.query.partner.findMany({
			where: (partner, { eq }) => eq(partner.departmentId, product.departmentId),

			with: {
				partnerProducts: {
					where: (partnerProduct, { eq, and }) =>
						and(eq(partnerProduct.status, "accepted"), eq(partnerProduct.productId, productId)),
					orderBy: (partnerProduct, { asc }) => asc(partnerProduct.createdAt)
				}
			},
			orderBy: (partner, { asc }) => asc(partner.name)
		}),
		chartData: await db.query.partner.findFirst({
			where: (partner, { eq }) => (partnerQuery ? eq(partner.name, partnerQuery) : undefined),
			with: {
				partnerProducts: {
					where: (partnerProduct, { eq, and }) =>
						and(eq(partnerProduct.status, "accepted"), eq(partnerProduct.productId, productId)),
					orderBy: (partnerProduct, { asc }) => asc(partnerProduct.createdAt)
				}
			}
		}),
		products: getLatestAvgPrice(q)
	};
};
