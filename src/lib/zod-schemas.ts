import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Type your email here"),
	password: z.string().min(1, { message: "Type your password here" })
});

export type LoginSchema = typeof loginSchema;
