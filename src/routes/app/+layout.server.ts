import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getUserDetails } from "$lib/server/user";

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");

	const userDetails = await getUserDetails(event);

	return {
		user: {
			...event.locals.user,
			...userDetails
		}
	};
};
