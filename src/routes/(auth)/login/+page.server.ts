import type { Actions } from "./$types.js";
import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { loginSchema } from "$lib/zod-schemas";
import { zod } from "sveltekit-superforms/adapters";
import { verify } from "@node-rs/argon2";
import db from "$lib/server/db";
import { lucia } from "$lib/server/auth.js";
import { getUserRedirect } from "$lib/utils";

export const load = async (event) => {
	if (event.locals.user) {
		const redirectPath = getUserRedirect(event.locals.user.role);
		redirect(302, redirectPath);
	}

	return {
		loginForm: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginSchema));

		if (!form.valid) return fail(400, { form });

		const { email, password } = form.data;

		const existingUser = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.email, email)
		});

		if (!existingUser) {
			return setError(form, "", "Incorrect username or password");
		}

		const validPassword = await verify(existingUser.hashedPassword, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return setError(form, "", "Incorrect username or password");
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		const redirectPath = getUserRedirect(existingUser.role);

		redirect(302, redirectPath);
	}
};
