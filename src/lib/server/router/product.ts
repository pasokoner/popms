import {
	acceptRequestSchema,
	createProductSchema,
	deleteRequestSchema,
	editProductSchema,
	rejectRequestSchema
} from "$lib/zod-schemas";
import { error, fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getDepartment } from "./department";
import db from "$lib/server/db";
import {
	partner,
	partnerProduct,
	product,
	type Partner,
	type Product
} from "$lib/server/db/schema";
import { and, asc, eq, getTableColumns, ilike, max } from "drizzle-orm";
import postgres from "postgres";
import { getUserDetails } from "./user";

export async function createProductAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "department") error(401);

	const department = await getDepartment(event.locals.user.id);

	if (!department) error(401, "Department not found");

	const form = await superValidate(event, zod(createProductSchema));

	if (!form.valid) return fail(400, { form });

	try {
		const newProducts = form.data.products.map((p) => ({
			...p,
			departmentId: department.id
		}));

		await db.insert(product).values(newProducts).execute();
	} catch (e) {
		if (e instanceof postgres.PostgresError) {
			if (e.constraint_name === "unique_product") {
				return setError(form, "", "Product with the same name & unit already exist");
			}
		}

		return setError(form, "", "Unable to add product");
	}

	return { form };
}

export async function editProductAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "department") error(401);

	const form = await superValidate(event, zod(editProductSchema));

	if (!form.valid) return fail(400, { form });

	const { productId, ...exceptId } = form.data;

	try {
		await db
			.update(product)
			.set({
				...exceptId
			})
			.where(eq(product.id, productId));
	} catch (e) {
		if (e instanceof postgres.PostgresError) {
			if (e.constraint_name === "unique_product") {
				return setError(form, "", "Product with the same name & unit already exist");
			}
		}

		return setError(form, "", "Unable to edit product");
	}

	return { form };
}

export async function acceptRequestAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "department") error(401);

	const form = await superValidate(event, zod(acceptRequestSchema));

	console.log("HIII");
	if (!form.valid) return fail(400, { form });

	const { departmentId } = await getUserDetails(event.locals.user);
	const { partnerProductId } = form.data;

	const existingProduct = await db.query.partnerProduct.findFirst({
		where: (partnerProduct, { eq }) => eq(partnerProduct.id, partnerProductId),
		with: {
			product: {
				columns: {
					departmentId: true
				}
			}
		}
	});

	if (!existingProduct) return setError(form, "", "Product not found");

	if (existingProduct.product.departmentId !== departmentId)
		return setError(form, "", "Product not found");

	if (existingProduct.status === "accepted") return setError(form, "", "Product already accepted");

	if (existingProduct.status === "rejected") return setError(form, "", "Product already rejected");

	try {
		await db
			.update(partnerProduct)
			.set({
				status: "accepted",
				updatedAt: new Date().toISOString()
			})
			.where(eq(partnerProduct.id, partnerProductId));
	} catch (e) {
		return setError(form, "", "Something went wrong");
	}

	return { form };
}

export async function rejectRequestAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");

	if (event.locals.user.role !== "department") error(401);

	const form = await superValidate(event, zod(rejectRequestSchema));

	if (!form.valid) return fail(400, { form });

	const { departmentId } = await getUserDetails(event.locals.user);
	const { partnerProductId } = form.data;

	const existingProduct = await db.query.partnerProduct.findFirst({
		where: (partnerProduct, { eq }) => eq(partnerProduct.id, partnerProductId),
		with: {
			product: {
				columns: {
					departmentId: true
				}
			}
		}
	});

	if (!existingProduct) return setError(form, "", "Product not found");

	if (existingProduct.product.departmentId !== departmentId)
		return setError(form, "", "Product not found");

	if (existingProduct.status === "accepted") return setError(form, "", "Product already accepted");

	if (existingProduct.status === "rejected") return setError(form, "", "Product already rejected");

	try {
		await db
			.update(partnerProduct)
			.set({
				status: "rejected",
				updatedAt: new Date().toISOString()
			})
			.where(eq(partnerProduct.id, partnerProductId));
	} catch (e) {
		return setError(form, "", "Something went wrong");
	}

	return { form };
}

export async function deleteRequestAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");

	const form = await superValidate(event, zod(deleteRequestSchema));

	if (!form.valid) return fail(400, { form });

	const { partnerId } = await getUserDetails(event.locals.user);
	const { partnerProductId } = form.data;

	const existingProduct = await db.query.partnerProduct.findFirst({
		where: (partnerProduct, { eq }) => eq(partnerProduct.id, partnerProductId)
	});

	if (!existingProduct) return setError(form, "", "Product not found");

	if (existingProduct.partnerId !== partnerId) return setError(form, "", "Product not found");

	if (existingProduct.status === "accepted") return setError(form, "", "Product already accepted");

	if (existingProduct.status === "rejected") return setError(form, "", "Product already rejected");

	try {
		await db.delete(partnerProduct).where(eq(partnerProduct.id, partnerProductId));
	} catch (e) {
		return setError(form, "", "Something went wrong");
	}

	return { form };
}

export async function getDepartmentWithProducts(ownerId: string) {
	return await db.query.department.findFirst({
		where: (department, { eq }) => eq(department.ownerId, ownerId),
		with: {
			products: {
				orderBy: (product, { asc }) => asc(product.name)
			}
		}
	});
}

export async function getDepartmentProducts(departmentId: string) {
	return await db.query.product.findMany({
		where: (product, { eq }) => eq(product.departmentId, departmentId),
		orderBy: (product, { asc }) => asc(product.name)
	});
}

export async function getPartnerTrackedProducts(partnerId: string) {
	return await db.query.partnerProduct.findMany({
		where: (partnerProduct, { eq, and }) =>
			and(eq(partnerProduct.partnerId, partnerId), eq(partnerProduct.status, "accepted")),
		with: {
			product: true
		},
		orderBy: (partnerProduct, { desc }) => desc(partnerProduct.updatedAt),
		limit: 1
	});
}

export async function getPartnerPendingProducts(partnerId: string) {
	return await db.query.partnerProduct.findMany({
		where: (partnerProduct, { and, eq }) =>
			and(eq(partnerProduct.partnerId, partnerId), eq(partnerProduct.status, "pending")),
		with: {
			product: true
		},
		orderBy: (partnerProduct, { desc }) => desc(partnerProduct.createdAt)
	});
}

export async function getDepartmentPendingProducts(departmentId: string) {
	return await db
		.select({
			...getTableColumns(partnerProduct),
			product: product,
			partner: partner
		})
		.from(partnerProduct)
		.leftJoin(product, eq(product.id, partnerProduct.productId))
		.leftJoin(partner, eq(partner.id, partnerProduct.partnerId))
		.where(and(eq(product.departmentId, departmentId), eq(partnerProduct.status, "pending")))
		.orderBy(partnerProduct.createdAt);
}

export async function getLatestAvgPrice(q: string | undefined | null) {
	const { partnerId, productId, price } = getTableColumns(partnerProduct);

	const latestPriceByPartners = db.$with("latest_price_by_partners").as(
		db
			.select({
				partnerId,
				productId,
				priceDate: max(partnerProduct.createdAt).as("price_date")
			})
			.from(partnerProduct)
			.where(eq(partnerProduct.status, "accepted"))
			.groupBy(partnerProduct.partnerId, partnerProduct.productId)
	);

	const result = await db
		.with(latestPriceByPartners)
		.select({
			product: product,
			partnerProduct: {
				price
			},
			partner: partner
		})
		.from(latestPriceByPartners)
		.leftJoin(
			partnerProduct,
			and(
				eq(latestPriceByPartners.partnerId, partnerProduct.partnerId),
				eq(latestPriceByPartners.productId, partnerProduct.productId),
				eq(latestPriceByPartners.priceDate, partnerProduct.createdAt)
			)
		)
		.leftJoin(product, eq(latestPriceByPartners.productId, product.id))
		.leftJoin(partner, eq(latestPriceByPartners.partnerId, partner.id))
		.where(q ? ilike(product.name, `%${q}%`) : undefined)
		.orderBy(asc(partnerProduct.price));

	const groupResult = result.reduce<
		Record<string, { product: Product; avgPrice: number; totalPrice: number; partners: Partner[] }>
	>((acc, row) => {
		const { product, partnerProduct, partner } = row;
		const price = Number(partnerProduct!.price);

		if (!acc[product!.id]) {
			acc[product!.id] = { product: product!, avgPrice: 0, totalPrice: 0, partners: [] };
		}

		if (partner) {
			acc[product!.id].partners.push(partner);
			acc[product!.id].totalPrice += price;
			acc[product!.id].avgPrice = acc[product!.id].totalPrice / acc[product!.id].partners.length;
		}
		return acc;
	}, {});

	return Object.values(groupResult);
}

export async function getLatestPrices(productId: string, departmentId: string) {
	return await db.query.partner.findMany({
		where: (partner, { eq }) => eq(partner.departmentId, departmentId),
		with: {
			partnerProducts: {
				where: (partnerProduct, { eq, and }) =>
					and(eq(partnerProduct.productId, productId), eq(partnerProduct.status, "accepted")),
				orderBy: (partnerProduct, { desc }) => desc(partnerProduct.createdAt)
			}
		},
		orderBy: (partner, { asc }) => asc(partner.name)
	});
}
