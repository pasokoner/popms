import type { Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { loginSchema } from "$lib/zod-schemas";
import { zod } from "sveltekit-superforms/adapters";

export const load = async () => {
	return {
		loginForm: superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginSchema));

		if (!form.valid) return fail(400, { form });

		const { username, password } = form.data;

		return { form };
	}
};
