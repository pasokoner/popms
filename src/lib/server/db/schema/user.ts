import { pgTable, text } from "drizzle-orm/pg-core";

const user = pgTable("user", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	hashedPassword: text("hashed_password").notNull()
});

export default user;
