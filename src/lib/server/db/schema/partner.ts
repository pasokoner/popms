import { pgTable, text, timestamp, uuid, unique, varchar } from "drizzle-orm/pg-core";
import department from "./department";
import user from "./user";

const partner = pgTable(
	"partner",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		departmentId: uuid("department_id")
			.notNull()
			.references(() => department.id),
		userId: text("user_id")
			.notNull()
			.references(() => user.id),
		createdAt: timestamp("created_at", {
			mode: "string"
		})
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", {
			mode: "string"
		})
			.notNull()
			.defaultNow()
	},
	(table) => {
		return {
			uniquePartner: unique().on(table.departmentId, table.userId)
		};
	}
);

export default partner;
