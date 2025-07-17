import z from "zod";

export const billingPlanSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  features: z.string().array(),
})

export const billingPlansSchema = z.object({
  plansLength: z.number(),
  plans: billingPlanSchema.array()
})

export const ProviderEnum = z.enum(["google", "github"]);

export const initializeSaasConfigSchema = z.object({
  name: z.string(),
  userId: z.string(),
  billing: billingPlansSchema,
  providers: ProviderEnum.array()
})

