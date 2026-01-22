import z from "zod";

export const loginSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"), // Make safe password,
  email: z.string().email("Invalid email"),
});

export type TLogin = z.infer<typeof loginSchema>;
