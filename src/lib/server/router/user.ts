import db from "$lib/server/db";
import { department, partner } from "$lib/server/db/schema";
import { sql } from "drizzle-orm";
import type { User } from "lucia";

type UserDetails = {
	name: string;
	departmentId: string;
	partnerId?: string;
};

export async function getUserDetails(user: User) {
	const { id, role } = user;

	let details: UserDetails | undefined;

	if (role === "department") {
		details = await db.query.department.findFirst({
			where: (dept, { eq }) => eq(dept.ownerId, id),
			extras: {
				departmentId: sql<string>`${department.id}`.as("department_id")
			}
		});
	} else if (role === "partner") {
		details = await db.query.partner.findFirst({
			where: (partner, { eq }) => eq(partner.ownerId, id),
			extras: {
				partnerId: sql<string>`${partner.id}`.as("partner_id")
			}
		});
	}

	if (!details) {
		return {
			name: "",
			departmentId: ""
		} as UserDetails;
	}

	return details;
}
