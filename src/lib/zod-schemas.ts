import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Type your email here"),
	password: z.string().min(1, { message: "Type your password here" })
});

export const createUserSchema = z.object({
	email: z.string().email("Type your email here"),
	password: z.string().min(8, { message: "Minimum 8 characters" })
});

export const createDepartmentSchema = createUserSchema.extend({
	name: z.string().min(1, { message: "Type your department name here" })
});

export const createPartnerSchema = createUserSchema.extend({
	name: z.string().min(1, { message: "Type your partner name here" })
});

export const editPartnerSchema = createPartnerSchema.extend({
	password: z
		.string()
		.optional()
		.refine((v) => {
			if (!v) {
				return true;
			}

			return v && v.length >= 8;
		}, "Minimum of 8 characters"),
	userId: z.string()
});

export const createProductSchema = z.object({
	products: z
		.array(
			z.object({
				name: z.string().min(1, { message: "Type your product name here" }),
				unit: z.string().min(1, { message: "Type your product unit here" })
			})
		)
		.min(1, "Type at least one product")
		.default([
			{
				name: "",
				unit: ""
			}
		])
});

export const editProductSchema = z.object({
	name: z.string().min(1, { message: "Type your product name here" }),
	unit: z.string().min(1, { message: "Type your product unit here" }),
	productId: z.string().uuid()
});

export type LoginSchema = typeof loginSchema;
export type CreateDepartmentSchema = typeof createDepartmentSchema;
export type CreatePartnerSchema = typeof createPartnerSchema;
export type EditPartnerSchema = typeof editPartnerSchema;
export type CreateProductSchema = typeof createProductSchema;
export type EditProductSchema = typeof editProductSchema;
