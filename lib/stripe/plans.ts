export const PLANS = {
  "job-access": {
    priceId: "price_1TlDxtGF5tgNc4Ilm2oooqG9",
    tier: "job_access",
  },
  "job-access-alerts": {
    priceId: "price_1TlDyGGF5tgNc4IlUcLOFs0z",
    tier: "alerts",
  },
  annual: {
    priceId: "price_1TlDygGF5tgNc4IlOTC1MPNW",
    tier: "alerts",
  },
} as const;

export type PlanSlug = keyof typeof PLANS;
