import { error, fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { createPartnerSchema, editPartnerSchema } from "$lib/zod-schemas";
import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";
import db from "./db";
import { partner, user } from "./db/schema";
import { getDepartmentByOwnerId } from "./departments";
import postgres from "postgres";
import { eq } from "drizzle-orm";

export async function createPartnerAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "department") redirect(302, "/login");

	const department = await getDepartmentByOwnerId(event.locals.user.id);

	if (!department) error(404, "Department not found");

	const form = await superValidate(event, zod(createPartnerSchema));

	if (!form.valid) return fail(400, { form });

	const { email, password, name } = form.data;

	const userId = generateIdFromEntropySize(10); // 16 characters long
	const hashedPassword = await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	try {
		await db.transaction(async (tx) => {
			await tx
				.insert(user)
				.values({
					id: userId,
					email: email,
					hashedPassword: hashedPassword,
					role: "partner"
				})
				.execute();

			await tx.insert(partner).values({
				departmentId: department.id,
				ownerId: userId,
				name: name
			});
		});
	} catch (e) {
		// check for unique constraint error in user table
		if (e instanceof postgres.PostgresError) {
			if (e.constraint_name === "auth_user_email_unique") {
				return setError(form, "email", "Email already taken");
			}
		}

		return setError(form, "", "Unable to create partner");
	}

	return { form };
}

export async function editPartnerAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "department") redirect(302, "/login");

	const department = await getDepartmentByOwnerId(event.locals.user.id);

	if (!department) error(404, "Department not found");

	// TODO: CHECK IF DEPARTMENT OWNS THE PRODUCT

	const form = await superValidate(event, zod(editPartnerSchema));

	if (!form.valid) return fail(400, { form });

	const { email, password, name, userId } = form.data;

	let hashedPassword: string | undefined;

	try {
		await db.transaction(async (tx) => {
			if (password) {
				hashedPassword = await hash(password, {
					memoryCost: 19456,
					timeCost: 2,
					outputLen: 32,
					parallelism: 1
				});
			}

			await tx
				.update(user)
				.set({
					email: email,
					...(password ? { password: hashedPassword } : undefined)
				})
				.where(eq(user.id, userId));

			await tx
				.update(partner)
				.set({
					name: name
				})
				.where(eq(partner.ownerId, userId));
		});
	} catch (e) {
		// check for unique constraint error in user table
		if (e instanceof postgres.PostgresError) {
			if (e.constraint_name === "auth_user_email_unique") {
				return setError(form, "email", "Email already taken");
			}
		}

		return setError(form, "", "Unable to create partner");
	}

	return { form };
}

export async function getPartnersByDepartmentID(id: string) {
	return await db.query.partner.findMany({
		where: (partner, { eq }) => eq(partner.departmentId, id)
	});
}
