import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import department from "./department";
import user from "./user";

const departmentOwner = pgTable(
	"department_owner",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		departmentId: uuid("department_id")
			.notNull()
			.references(() => department.id),
		ownerId: text("owner_id")
			.notNull()
			.references(() => user.id)
	},
	(table) => {
		return {
			uniqueOwner: unique().on(table.departmentId, table.ownerId)
		};
	}
);

export default departmentOwner;
