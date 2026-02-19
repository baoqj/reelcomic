import { db } from '../neon';
import { VipPlanCode } from '../stripe';

interface UserStripeRow {
  id: string;
  email: string;
  display_name: string;
  stripe_customer_id: string | null;
}

export const getUserStripeProfile = async (userId: string): Promise<UserStripeRow | null> => {
  const rows = (await db`
    select id, email, display_name, stripe_customer_id
    from users
    where id = ${userId}
    limit 1
  `) as UserStripeRow[];
  return rows[0] || null;
};

export const setUserStripeCustomerId = async (userId: string, stripeCustomerId: string) => {
  await db`
    update users
    set stripe_customer_id = ${stripeCustomerId},
        updated_at = now()
    where id = ${userId}
  `;
};

export const findUserByStripeCustomerId = async (
  stripeCustomerId: string,
): Promise<{ id: string } | null> => {
  const rows = (await db`
    select id
    from users
    where stripe_customer_id = ${stripeCustomerId}
    limit 1
  `) as Array<{ id: string }>;
  return rows[0] || null;
};

const resolvePlanId = async (planCode: VipPlanCode) => {
  const rows = (await db`
    select id
    from subscription_plans
    where code = ${planCode}
    limit 1
  `) as Array<{ id: string }>;
  if (!rows[0]) {
    throw new Error(`subscription_plans missing for code=${planCode}`);
  }
  return rows[0].id;
};

export const upsertSubscriptionFromStripe = async (input: {
  userId: string;
  planCode: VipPlanCode;
  stripeSubscriptionId: string;
  stripePriceId?: string | null;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';
  startedAtISO: string;
  expiresAtISO: string;
  autoRenew: boolean;
}) => {
  const planId = await resolvePlanId(input.planCode);
  await db`
    insert into subscriptions
      (user_id, plan_id, status, started_at, expires_at, auto_renew, stripe_subscription_id, stripe_price_id)
    values
      (${input.userId}, ${planId}, ${input.status}, ${input.startedAtISO}, ${input.expiresAtISO}, ${input.autoRenew}, ${input.stripeSubscriptionId}, ${input.stripePriceId || null})
    on conflict (stripe_subscription_id)
    do update set
      user_id = excluded.user_id,
      plan_id = excluded.plan_id,
      status = excluded.status,
      started_at = excluded.started_at,
      expires_at = excluded.expires_at,
      auto_renew = excluded.auto_renew,
      stripe_price_id = excluded.stripe_price_id,
      updated_at = now()
  `;
};

export const upsertVipTierForUser = async (input: {
  userId: string;
  vipTier: 'free' | 'vip_monthly' | 'vip_yearly';
}) => {
  await db`
    update users
    set vip_tier = ${input.vipTier},
        updated_at = now()
    where id = ${input.userId}
  `;
};

export const insertPaymentEvent = async (input: {
  userId: string;
  stripeInvoiceId?: string | null;
  stripePaymentIntentId?: string | null;
  amountCents: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  stripeSubscriptionId?: string | null;
  paidAtISO?: string | null;
}) => {
  await db`
    insert into payments
      (subscription_id, user_id, provider, provider_txn_id, amount_cents, currency, status, paid_at, stripe_invoice_id, stripe_payment_intent_id)
    values
      (
        (
          select id from subscriptions where stripe_subscription_id = ${input.stripeSubscriptionId || null} limit 1
        ),
        ${input.userId},
        'stripe',
        ${input.stripeInvoiceId || input.stripePaymentIntentId || null},
        ${input.amountCents},
        ${input.currency.toUpperCase()},
        ${input.status},
        ${input.paidAtISO || null},
        ${input.stripeInvoiceId || null},
        ${input.stripePaymentIntentId || null}
      )
  `;
};

export const markWebhookEventProcessed = async (eventId: string) => {
  const rows = (await db`
    insert into stripe_webhook_events (stripe_event_id, processed_at)
    values (${eventId}, now())
    on conflict (stripe_event_id)
    do nothing
    returning stripe_event_id
  `) as Array<{ stripe_event_id: string }>;
  return rows.length > 0;
};
