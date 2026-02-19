import { getAppBaseUrl, sendJson } from '../../server/auth/http';
import { readAuthUserFromRequest } from '../../server/auth/session';
import { getUserStripeProfile } from '../../server/billing/store';
import { getStripe } from '../../server/stripe';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const authUser = await readAuthUserFromRequest(req);
    if (!authUser) {
      sendJson(res, 401, { error: '请先登录' });
      return;
    }

    const user = await getUserStripeProfile(authUser.id);
    if (!user?.stripe_customer_id) {
      sendJson(res, 400, { error: '该用户尚未创建 Stripe 订阅账户' });
      return;
    }

    const stripe = getStripe();
    const baseURL = getAppBaseUrl(req).replace(/\/+$/, '');
    const returnUrl = process.env.STRIPE_PORTAL_RETURN_URL || `${baseURL}/#/subscription`;
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: returnUrl,
    });

    sendJson(res, 200, { ok: true, portalUrl: portalSession.url });
  } catch (error: any) {
    console.error('POST /api/billing/portal failed', error);
    sendJson(res, 500, { error: error?.message || '创建账单管理会话失败' });
  }
}
