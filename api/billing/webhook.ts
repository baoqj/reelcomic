import Stripe from 'stripe';
import { getStripe, getPlanCodeFromStripePrice, getVipTierFromPlanCode, VipPlanCode } from '../../server/stripe';
import {
  findUserByStripeCustomerId,
  insertPaymentEvent,
  markWebhookEventProcessed,
  upsertSubscriptionFromStripe,
  upsertVipTierForUser,
} from '../../server/billing/store';

const readRawBody = async (req: any): Promise<Buffer> => {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

const parsePlanCode = (
  subscription: any,
  checkoutSession?: Stripe.Checkout.Session | null,
): VipPlanCode | null => {
  const fromMetadata = subscription.metadata?.planCode || checkoutSession?.metadata?.planCode;
  if (fromMetadata === 'vip_monthly' || fromMetadata === 'vip_yearly') return fromMetadata;
  const stripePriceId = subscription.items.data[0]?.price?.id || null;
  return getPlanCodeFromStripePrice(stripePriceId);
};

const syncSubscription = async (input: {
  stripe: Stripe;
  subscriptionId: string;
  checkoutSession?: Stripe.Checkout.Session | null;
}) => {
  const subscription = (await input.stripe.subscriptions.retrieve(input.subscriptionId)) as any;
  const customerId =
    typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
  if (!customerId) return;
  const user = await findUserByStripeCustomerId(customerId);
  if (!user) return;

  const planCode = parsePlanCode(subscription, input.checkoutSession);
  if (!planCode) return;

  const periodStart = subscription.current_period_start
    ? new Date(subscription.current_period_start * 1000)
    : new Date();
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : new Date(Date.now() + 30 * 24 * 3600 * 1000);

  const status =
    subscription.status === 'active'
      ? 'active'
      : subscription.status === 'trialing'
        ? 'trialing'
        : subscription.status === 'past_due'
          ? 'past_due'
          : subscription.status === 'canceled' || subscription.status === 'incomplete_expired'
            ? 'canceled'
            : 'expired';

  await upsertSubscriptionFromStripe({
    userId: user.id,
    planCode,
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0]?.price?.id || null,
    status,
    startedAtISO: periodStart.toISOString(),
    expiresAtISO: periodEnd.toISOString(),
    autoRenew: !subscription.cancel_at_period_end,
  });

  await upsertVipTierForUser({
    userId: user.id,
    vipTier: status === 'active' || status === 'trialing' ? getVipTierFromPlanCode(planCode) : 'free',
  });
};

const handleInvoiceEvent = async (invoice: any, status: 'succeeded' | 'failed') => {
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;
  const user = await findUserByStripeCustomerId(customerId);
  if (!user) return;
  const paidAt =
    invoice.status_transitions?.paid_at
      ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
      : null;
  await insertPaymentEvent({
    userId: user.id,
    stripeInvoiceId: invoice.id,
    stripePaymentIntentId:
      typeof invoice.payment_intent === 'string' ? invoice.payment_intent : invoice.payment_intent?.id,
    amountCents: invoice.amount_paid || invoice.amount_due || 0,
    currency: invoice.currency || 'usd',
    status,
    stripeSubscriptionId:
      typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id,
    paidAtISO: paidAt,
  });
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    res.status(500).json({ error: 'Missing STRIPE_WEBHOOK_SECRET' });
    return;
  }

  try {
    const stripe = getStripe();
    const signatureHeader = req.headers['stripe-signature'];
    const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    if (!signature) {
      res.status(400).json({ error: 'Missing stripe-signature' });
      return;
    }
    const rawBody = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    const inserted = await markWebhookEventProcessed(event.id);
    if (!inserted) {
      res.status(200).json({ received: true, duplicate: true });
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription' && session.subscription) {
          const subscriptionId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id;
          await syncSubscription({ stripe, subscriptionId, checkoutSession: session });
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await syncSubscription({ stripe, subscriptionId: subscription.id });
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as any;
        await handleInvoiceEvent(invoice, 'succeeded');
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        await handleInvoiceEvent(invoice, 'failed');
        break;
      }
      default:
        break;
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('POST /api/billing/webhook failed', error);
    res.status(400).json({ error: error?.message || 'Webhook handling failed' });
  }
}
