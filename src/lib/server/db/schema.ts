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
const partnerProductRequestStatus = ["pending", "accepted", "rejected"] as const;

export type UserRole = (typeof userRoles)[number];
export type PartnerProductRequestStatus = (typeof partnerProductRequestStatus)[number];

export const userRole = pgEnum("role", userRoles);
export const partnerProductRequestStatusEnum = pgEnum(
	"partner_product_request_status",
	partnerProductRequestStatus
);

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

export const product = pgTable(
	"product",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
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
	},
	(table) => {
		return {
			uniqueProduct: unique("unique_product").on(table.name, table.unit)
		};
	}
);

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
		ownerId: text("owner_id")
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
			uniquePartner: unique().on(table.departmentId, table.ownerId)
		};
	}
);

export const partnerProduct = pgTable("partner_product", {
	id: uuid("id").defaultRandom().primaryKey(),
	price: numeric("price", { precision: 12, scale: 2 }).notNull(),
	status: partnerProductRequestStatusEnum("status").notNull().default("pending"),
	partnerId: uuid("partner_id")
		.notNull()
		.references(() => partner.id),
	productId: uuid("product_id")
		.notNull()
		.references(() => product.id),
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

export const departmentRelations = relations(department, ({ one, many }) => ({
	owner: one(user, {
		fields: [department.ownerId],
		references: [user.id]
	}),
	partners: many(partner),
	products: many(product)
}));

export const partnerRelations = relations(partner, ({ one, many }) => ({
	department: one(department, {
		fields: [partner.departmentId],
		references: [department.id]
	}),
	user: one(user, {
		fields: [partner.ownerId],
		references: [user.id]
	}),
	partnerProducts: many(partnerProduct)
}));

export const productRelations = relations(product, ({ one, many }) => ({
	department: one(department, {
		fields: [product.departmentId],
		references: [department.id]
	}),
	partnerProducts: many(partnerProduct)
}));

export const partnerProductRelations = relations(partnerProduct, ({ one }) => ({
	partner: one(partner, {
		fields: [partnerProduct.partnerId],
		references: [partner.id]
	}),
	product: one(product, {
		fields: [partnerProduct.productId],
		references: [product.id]
	})
}));

export type User = InferSelectModel<typeof user>;
export type Department = InferSelectModel<typeof department>;
export type Partner = InferSelectModel<typeof partner>;
export type Product = InferSelectModel<typeof product>;
export type PartnerProduct = InferSelectModel<typeof partnerProduct>;

export type DepartmentWithOwner = Department & {
	owner: Omit<User, "hashedPassword">;
};

export type PartnerWithUser = Partner & {
	user: Omit<User, "hashedPassword">;
};

export type PartnerProductWithProduct = PartnerProduct & {
	product: Product;
};
