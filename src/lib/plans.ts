export const PLANS = {
  starter: {
    name: "Starter",
    credits: 100,
    price: 10,
    price_id: "price_1TDn6t2Ol3wRndcDFixxGTzo",
    product_id: "prod_UCBT1h1vwyRMNg",
  },
  pro: {
    name: "Pro",
    credits: 300,
    price: 25,
    price_id: "price_1TDn7A2Ol3wRndcDQ7o4Eb4n",
    product_id: "prod_UCBUpVQjh4HJjX",
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanByProductId(productId: string): (typeof PLANS)[PlanKey] | null {
  return Object.values(PLANS).find((p) => p.product_id === productId) ?? null;
}
