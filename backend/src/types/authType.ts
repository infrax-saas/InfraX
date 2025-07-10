import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().optional(),
  email: z.email(),
  password: z.string().min(6),
  tenantId: z.string(),
  metadata: z.object({}).optional(),
});

export const loginSchema = z.object({
  username: z.string().optional(),
  email: z.email(),
  password: z.string().min(6),
  tenantId: z.string(),
});
