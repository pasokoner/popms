import { createProductSchema, editProductSchema } from "$lib/zod-schemas";
import { error, fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getDepartmentByOwnerId } from "./departments";
import db from "./db";
import { product } from "./db/schema";
import { eq } from "drizzle-orm";

export async function createProductAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "department") error(401);

	const department = await getDepartmentByOwnerId(event.locals.user.id);

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
		return setError(form, "", "Unable to add product");
	}

	return { form };
}

export async function editProductAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "department") error(401);

	const department = await getDepartmentByOwnerId(event.locals.user.id);

	if (!department) error(401, "Department not found");

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
		return setError(form, "", "Unable to edit product");
	}

	return { form };
}

export async function getDepartmentWithProductByOwnerId(id: string) {
	return await db.query.department.findFirst({
		where: (department, { eq }) => eq(department.ownerId, id),
		with: {
			products: true
		}
	});
}
