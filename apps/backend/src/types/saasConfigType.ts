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

export const ProviderEnum = z.enum(["google", "github", "microsoft", "apple"]);

export const ProviderConfigSchema = z.object({
  type: ProviderEnum,
  appId: z.string().min(1, "App ID cannot be empty"),
  secretKey: z.string().min(1, "Secret Key cannot be empty"),
});

export const initializeSaasConfigSchema = z.object({
  name: z.string(),
  userId: z.string(),
  billing: billingPlansSchema,
  providers: ProviderConfigSchema.array()
})

export const addProviderSchema = z.object({
  id: z.string(),
  provider: ProviderConfigSchema
})

export type initializeSaasConfigOutputSchema = {
  message: string
}


