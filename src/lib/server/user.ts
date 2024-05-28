import { redirect, type RequestEvent } from "@sveltejs/kit";
import db from "./db";
import type { UserRole } from "./db/schema";

type UserDetails = {
	name: string;
};

export async function getUserByEmail(email: string) {
	return await db.query.user.findFirst({ where: (user, { eq }) => eq(user.email, email) });
}

export async function getUserDetails(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");

	const { id, role } = event.locals.user;

	const defaultDetails: UserDetails = {
		name: ""
	};

	let details: UserDetails | undefined;

	if (role === "department") {
		details = await db.query.department.findFirst({
			where: (dept, { eq }) => eq(dept.ownerId, id)
		});
	} else if (role === "partner") {
		details = await db.query.partner.findFirst({
			where: (partner, { eq }) => eq(partner.userId, id)
		});
	}

	return details || defaultDetails;
}

export function getUserRedirect(role: UserRole) {
	switch (role) {
		case "admin":
			return "/admin";
		case "department":
			return "/department/dashboard";
		case "partner":
			return "/partner/dashboard";
	}
}
