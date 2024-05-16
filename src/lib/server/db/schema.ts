import { relations, type InferSelectModel } from "drizzle-orm";
import {
	pgTable,
	timestamp,
	uuid,
	varchar,
	text,
	unique,
	numeric,
	pgEnum
} from "drizzle-orm/pg-core";

const userRoles = ["owner", "partner", "admin"] as const;

export type UserRole = (typeof userRoles)[number];

export const userRole = pgEnum("role", userRoles);

export const user = pgTable("auth_user", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	hashedPassword: text("hashed_password").notNull(),
	role: userRole("role").notNull()
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const product = pgTable("product", {
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

export const department = pgTable("department", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", {
		mode: "string"
	})
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", {
		mode: "string"
	})
		.notNull()
		.defaultNow(),
	ownerId: text("owner_id")
		.notNull()
		.unique()
		.references(() => user.id)
});

// Multiple owner per department & multiple department per owner
// export const departmentOwner = pgTable(
// 	"department_owner",
// 	{
// 		id: uuid("id").defaultRandom().primaryKey(),
// 		departmentId: uuid("department_id")
// 			.notNull()
// 			.references(() => department.id)
// 	},
// 	(table) => {
// 		return {
// 			uniqueOwner: unique().on(table.departmentId, table.ownerId)
// 		};
// 	}
// );

export const partner = pgTable(
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

export const departmentRelations = relations(department, ({ one }) => ({
	owner: one(user, {
		fields: [department.ownerId],
		references: [user.id]
	})
}));

export type User = InferSelectModel<typeof user>;
export type Department = InferSelectModel<typeof department>;

export type DepartmentWithOwner = Department & {
	owner: Omit<User, "hashedPassword">;
};
