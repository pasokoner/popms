import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { createDepartmentSchema } from "$lib/zod-schemas";
import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";
import db from "./db";
import { department, user } from "./db/schema";
import postgres from "postgres";

export async function createDepartmentAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/login");

	const form = await superValidate(event, zod(createDepartmentSchema));

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
					role: "owner"
				})
				.execute();

			await tx.insert(department).values({
				ownerId: userId,
				name: name
			});
		});
	} catch (e) {
		// check for unique constraint error in user table
		if (e instanceof postgres.PostgresError) {
			console.log(e.constraint_name);
			if (e.constraint_name === "auth_user_email_unique") {
				console.log("WTFFF??");
				return setError(form, "email", "Email already taken");
			}
		}

		return setError(form, "", "Unable to create department");
	}

	return { form };
}

export async function getDepartmentWithOwner() {
	return await db.query.department.findMany({
		with: {
			owner: {
				columns: {
					hashedPassword: false
				}
			}
		}
	});
}
