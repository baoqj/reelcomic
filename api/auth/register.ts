import { randomToken, parseJsonBody, sendJson } from '../../server/auth/http';
import { hashPassword } from '../../server/auth/password';
import {
  createUser,
  findUserByEmail,
  linkProviderAccount,
  upsertCredentials,
} from '../../server/auth/store';
import { createAuthSession } from '../../server/auth/session';

interface RegisterBody {
  email?: string;
  password?: string;
  displayName?: string;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = await parseJsonBody<RegisterBody>(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const displayName = String(body.displayName || '').trim();

    if (!isValidEmail(email)) {
      sendJson(res, 400, { error: '请输入有效邮箱地址' });
      return;
    }
    if (displayName.length < 2 || displayName.length > 40) {
      sendJson(res, 400, { error: '昵称长度需在 2-40 之间' });
      return;
    }
    if (password.length < 8) {
      sendJson(res, 400, { error: '密码至少 8 位' });
      return;
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      sendJson(res, 409, { error: '该邮箱已注册，请直接登录' });
      return;
    }

    const user = await createUser({ email, displayName });
    await upsertCredentials(user.id, hashPassword(password));
    await linkProviderAccount({
      userId: user.id,
      provider: 'credentials',
      providerUserId: email,
      providerEmail: email,
    });

    const rawSessionToken = randomToken(32);
    await createAuthSession({ req, res, userId: user.id, rawToken: rawSessionToken });

    sendJson(res, 200, { ok: true, user });
  } catch (error: any) {
    console.error('POST /api/auth/register failed', error);
    sendJson(res, 500, { error: error?.message || '注册失败' });
  }
}
