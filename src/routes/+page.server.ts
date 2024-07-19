import type { PageServerLoad } from "./$types";

import { getLatestAvgPrice } from "$lib/server/router/product";

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get("q");
	const municipalities = url.searchParams.get("municipalities");

	console.log(municipalities?.split(","));

	return {
		products: getLatestAvgPrice(q)
	};
};
