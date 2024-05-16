import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Type your email here"),
	password: z.string().min(1, { message: "Type your password here" })
});

export const createDepartmentSchema = z.object({
	name: z.string().min(1, { message: "Type your department name here" }),
	email: z.string().email("Type your email here"),
	password: z.string().min(8, { message: "Minimum 8 characters" })
});

export type LoginSchema = typeof loginSchema;
export type CreateDepartmentSchema = typeof createDepartmentSchema;
