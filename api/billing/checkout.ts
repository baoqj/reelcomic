import { getAppBaseUrl, parseJsonBody, sendJson } from '../../server/auth/http';
import { readAuthUserFromRequest } from '../../server/auth/session';
import { getStripe, getPlanCodeByCycle, stripePriceConfigByPlan, VipPlanCode } from '../../server/stripe';
import { getUserStripeProfile, setUserStripeCustomerId } from '../../server/billing/store';

interface CheckoutBody {
  planCode?: VipPlanCode;
  cycle?: 'monthly' | 'yearly';
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const authUser = await readAuthUserFromRequest(req);
    if (!authUser) {
      sendJson(res, 401, { error: '请先登录后再订阅' });
      return;
    }

    const body = await parseJsonBody<CheckoutBody>(req);
    const planCode = body.planCode || (body.cycle ? getPlanCodeByCycle(body.cycle) : null);
    if (!planCode || !(planCode in stripePriceConfigByPlan)) {
      sendJson(res, 400, { error: '无效订阅套餐' });
      return;
    }

    const user = await getUserStripeProfile(authUser.id);
    if (!user) {
      sendJson(res, 404, { error: '用户不存在' });
      return;
    }

    const stripe = getStripe();
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.display_name,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await setUserStripeCustomerId(user.id, customerId);
    }

    const plan = stripePriceConfigByPlan[planCode];
    const envPriceId = process.env[plan.envPriceIdKey];
    const baseURL = getAppBaseUrl(req).replace(/\/+$/, '');
    const successUrl =
      process.env.STRIPE_SUCCESS_URL || `${baseURL}/#/subscription?payment=success`;
    const cancelUrl =
      process.env.STRIPE_CANCEL_URL || `${baseURL}/#/subscription?payment=cancel`;

    const lineItem = envPriceId
      ? ({ price: envPriceId, quantity: 1 } as const)
      : ({
          price_data: {
            currency: 'usd',
            unit_amount: plan.amountCents,
            recurring: { interval: plan.interval },
            product_data: { name: plan.displayName },
          },
          quantity: 1,
        } as const);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [lineItem],
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        planCode,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planCode,
        },
      },
    });

    if (!session.url) {
      sendJson(res, 500, { error: 'Stripe Checkout URL creation failed' });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('POST /api/billing/checkout failed', error);
    sendJson(res, 500, { error: error?.message || '创建支付会话失败' });
  }
}
