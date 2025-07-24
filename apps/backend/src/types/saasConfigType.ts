import z from "zod";

enum Category {
  Productivity = "Productivity",
  Analytics = "Analytics",
  Ecommerce = "Ecommerce",
  Communication = "Communication",
  Finance = "Finance",
  AIML = "AIML",
  CRM = "CRM",
  Marketing = "Marketing",
  Other = "Other",
}

enum Status {
  active = "active",
  inactive = "inactive",
  developing = "developing",
}

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
  description: z.string(),
  category: z.nativeEnum(Category),
  status: z.nativeEnum(Status),
  billing: billingPlansSchema,
  providers: ProviderConfigSchema.array()
});

export const addProviderSchema = z.object({
  id: z.string(),
  provider: ProviderConfigSchema
})

export const toggleProviderSchema = z.object({
  id: z.string()
})

export type initializeSaasConfigOutputSchema = {
  message: string
}

export const getSaaSByIDConfigSchema = z.object({
  id: z.string()
})


export const updateProviderSchema = z.object({
  providerId: z.string(),
  clientID: z.string(),
  clientSecret: z.string(),
  type: ProviderEnum
})
