// TEST price IDs — swap for live price IDs before going live
export const PLANS = {
  "job-access": {
    priceId: "price_1TiyNn4sPWjbAzORH6VM1GqG",
    tier: "job_access",
  },
  "job-access-alerts": {
    priceId: "price_1Tiz2x4sPWjbAzORwm4FTJ1T",
    tier: "alerts",
  },
  annual: {
    priceId: "price_1Tiz4M4sPWjbAzORXf4qqF3d",
    tier: "alerts",
  },
} as const;

export type PlanSlug = keyof typeof PLANS;
