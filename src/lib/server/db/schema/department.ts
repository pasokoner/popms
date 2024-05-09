import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const department = pgTable("department", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	acronym: varchar("acronym", { length: 255 }).notNull(),
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

export default department;
