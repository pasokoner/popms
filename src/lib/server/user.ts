import { redirect, type RequestEvent } from "@sveltejs/kit";
import db from "./db";
import { department, partner, type UserRole } from "./db/schema";
import { sql } from "drizzle-orm";

type UserDetails = {
	name: string;
	groupId: string;
	departmentId: string;
};

export async function getUserByEmail(email: string) {
	return await db.query.user.findFirst({ where: (user, { eq }) => eq(user.email, email) });
}

export async function getUserDetails(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");

	const { id, role } = event.locals.user;

	const defaultDetails: UserDetails = {
		name: "",
		groupId: "",
		departmentId: ""
	};

	let details: UserDetails | undefined;

	if (role === "department") {
		details = await db.query.department.findFirst({
			where: (dept, { eq }) => eq(dept.ownerId, id),
			extras: {
				groupId: sql<string>`${department.id}`.as("group_id"),
				departmentId: sql<string>`${department.id}`.as("department_id")
			}
		});
	} else if (role === "partner") {
		details = await db.query.partner.findFirst({
			where: (partner, { eq }) => eq(partner.ownerId, id),
			extras: {
				groupId: sql<string>`${partner.id}`.as("group_id")
			}
		});
	}

	return details || defaultDetails;
}

export function getUserRedirect(role: UserRole) {
	switch (role) {
		case "admin":
			return "/app/admin";
		case "department":
			return "/app/department/dashboard";
		case "partner":
			return "/app/partner/dashboard";
	}
}
