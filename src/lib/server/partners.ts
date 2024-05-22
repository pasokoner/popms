import db from "./db";

export async function getPartnersByDepartmentID(id: string) {
	return await db.query.partner.findMany({
		where: (partner, { eq }) => eq(partner.departmentId, id)
	});
}
