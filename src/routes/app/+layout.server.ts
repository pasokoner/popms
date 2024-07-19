import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getUserDetails } from "$lib/server/router/user";

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");

	const userDetails = await getUserDetails(event.locals.user);

	return {
		user: {
			...event.locals.user,
			...userDetails
		}
	};
};
