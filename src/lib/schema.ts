import { z } from "zod";

export const pricingModelSchema = z.enum([
  "free",
  "freemium",
  "paid",
  "enterprise",
]);

export const badgeSchema = z.enum(["Free", "Freemium", "Paid"]);

export const freeTierSchema = z.object({
  available: z.boolean(),
  limits: z.string().optional(),
});

export const paidTierSchema = z.object({
  isCustomPricing: z.boolean(),
  startingPrice: z.number().nonnegative().optional(),
  currency: z.literal("USD").optional(),
  billingUnit: z
    .enum([
      "per month",
      "per user / month",
      "per year",
      "one-time",
      "usage-based",
      "custom",
    ])
    .optional(),
  notes: z.string().optional(),
});

export const toolSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, "id must be kebab-case"),
    name: z.string().min(1),
    logoInitial: z.string().min(1).max(3).optional(),
    bestFor: z.string().min(1),
    description: z.string().min(1),
    functions: z.array(z.string().min(1)).min(1),
    phases: z.array(z.string().min(1)).min(1),
    pricingModel: pricingModelSchema,
    badge: badgeSchema,
    freeTier: freeTierSchema,
    paidTier: paidTierSchema,
    topPick: z.boolean(),
    enterpriseReady: z.boolean(),
    officialUrl: z.string().url(),
    sourceUrl: z.string().url(),
    lastChecked: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "lastChecked must be YYYY-MM-DD"),
    addedOn: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "addedOn must be YYYY-MM-DD"),
  })
  .strict();

export type Tool = z.infer<typeof toolSchema>;

export const subFunctionSchema = z
  .object({
    name: z.string().min(1),
    aiUseCase: z.string().min(1),
  })
  .strict();

export type SubFunction = z.infer<typeof subFunctionSchema>;

export const workflowStageSchema = z
  .object({
    name: z.string().min(1),
    icon: z.string().min(1),
    items: z.array(z.string().min(1)).min(2).max(4),
    // Tool ids relevant to this specific stage of the function's internal
    // workflow — a subset of that function's own tools (see functionSchema's
    // own tools-by-functions.json cross-reference), not a free choice from
    // the whole registry. Optional so existing stages keep validating while
    // this gets filled in; the drill-down falls back to nothing shown for a
    // stage with no mapping yet rather than guessing.
    toolIds: z.array(z.string().min(1)).optional(),
    // For a stage where no registry tool genuinely fits (checked, not
    // skipped) — a short, honest note on the generic path: an MCP server,
    // a vendor API, or a general-purpose AI assistant, rather than forcing
    // a weak tool match just to fill the slot.
    noToolSuggestion: z.string().min(1).optional(),
  })
  .strict();

export type WorkflowStage = z.infer<typeof workflowStageSchema>;

export const functionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    shortName: z.string().min(1).optional(),
    description: z.string().min(1),
    icon: z.string().min(1),
    subtypes: z.array(subFunctionSchema).min(1),
    workflow: z.array(workflowStageSchema).min(3).max(6),
  })
  .strict();

export type BusinessFunction = z.infer<typeof functionSchema>;

export const functionConnectionSchema = z
  .object({
    from: z.string().min(1),
    to: z.string().min(1),
    relationship: z.string().min(1),
  })
  .strict();

export type FunctionConnection = z.infer<typeof functionConnectionSchema>;

export const phaseSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    description: z.string().min(1),
    order: z.number().int().nonnegative(),
  })
  .strict();

export type LifecyclePhase = z.infer<typeof phaseSchema>;

export const toolsFileSchema = z.array(toolSchema);
