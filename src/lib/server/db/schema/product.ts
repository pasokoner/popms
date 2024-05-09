import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import department from "./department";

const product = pgTable("product", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	price: numeric("price", { precision: 12, scale: 2 }).notNull(),
	unit: text("unit").notNull(),
	municipality: text("municipality").notNull(),
	departmentId: uuid("department_id")
		.notNull()
		.references(() => department.id),
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
});

export default product;
