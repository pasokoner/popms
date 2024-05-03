import { z } from "zod";

export const loginSchema = z.object({
	username: z.string().min(1, { message: "Type your username here" }),
	password: z.string().min(1, { message: "Type your password here" })
});

export type LoginSchema = typeof loginSchema;
