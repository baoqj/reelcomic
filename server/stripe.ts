import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
};

export type VipPlanCode = 'vip_monthly' | 'vip_yearly';

export const stripePriceConfigByPlan: Record<
  VipPlanCode,
  {
    envPriceIdKey: 'STRIPE_PRICE_VIP_MONTHLY' | 'STRIPE_PRICE_VIP_YEARLY';
    amountCents: number;
    interval: 'month' | 'year';
    displayName: string;
  }
> = {
  vip_monthly: {
    envPriceIdKey: 'STRIPE_PRICE_VIP_MONTHLY',
    amountCents: 999,
    interval: 'month',
    displayName: 'ReelComic VIP Monthly',
  },
  vip_yearly: {
    envPriceIdKey: 'STRIPE_PRICE_VIP_YEARLY',
    amountCents: 9599,
    interval: 'year',
    displayName: 'ReelComic VIP Yearly',
  },
};

export const getPlanCodeByCycle = (cycle: string): VipPlanCode | null => {
  if (cycle === 'monthly') return 'vip_monthly';
  if (cycle === 'yearly') return 'vip_yearly';
  return null;
};

export const getVipTierFromPlanCode = (planCode: VipPlanCode): 'vip_monthly' | 'vip_yearly' => {
  return planCode === 'vip_yearly' ? 'vip_yearly' : 'vip_monthly';
};

export const getPlanCodeFromStripePrice = (priceId?: string | null): VipPlanCode | null => {
  if (!priceId) return null;
  if (process.env.STRIPE_PRICE_VIP_MONTHLY && priceId === process.env.STRIPE_PRICE_VIP_MONTHLY) {
    return 'vip_monthly';
  }
  if (process.env.STRIPE_PRICE_VIP_YEARLY && priceId === process.env.STRIPE_PRICE_VIP_YEARLY) {
    return 'vip_yearly';
  }
  return null;
};
