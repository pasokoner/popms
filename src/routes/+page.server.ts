import type { PageServerLoad } from "./$types";

import { getLatestAvgPrice } from "$lib/server/products";

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get("q");

	return {
		products: getLatestAvgPrice(q)
	};
};
