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

const userRoles = ["department", "partner", "admin"] as const;

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

export const partner = pgTable(
	"partner",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
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

export const departmentRelations = relations(department, ({ one, many }) => ({
	owner: one(user, {
		fields: [department.ownerId],
		references: [user.id]
	}),
	partners: many(partner)
}));

export const partnerRelations = relations(partner, ({ one }) => ({
	department: one(department, {
		fields: [partner.departmentId],
		references: [department.id]
	})
}));

export const productRelations = relations(product, ({ one }) => ({
	department: one(department, {
		fields: [product.departmentId],
		references: [department.id]
	})
}));

export type User = InferSelectModel<typeof user>;
export type Department = InferSelectModel<typeof department>;
export type Partner = InferSelectModel<typeof partner>;
export type Product = InferSelectModel<typeof product>;

export type DepartmentWithOwner = Department & {
	owner: Omit<User, "hashedPassword">;
};

export type PartnerWithUser = Partner & {
	user: Omit<User, "hashedPassword">;
};
