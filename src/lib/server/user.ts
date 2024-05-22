import db from "./db";
import type { UserRole } from "./db/schema";

export async function getUserByEmail(email: string) {
	return await db.query.user.findFirst({ where: (user, { eq }) => eq(user.email, email) });
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
