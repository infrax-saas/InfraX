import { z } from "zod";

export const registerSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string().min(6),
  saasId: z.string()
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  saasId: z.string()
});

export const verifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string()
})
