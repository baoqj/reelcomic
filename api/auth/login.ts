import { parseJsonBody, randomToken, sendJson } from '../../server/auth/http';
import { verifyPassword } from '../../server/auth/password';
import { findCredentialsByEmail } from '../../server/auth/store';
import { createAuthSession } from '../../server/auth/session';

interface LoginBody {
  email?: string;
  password?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = await parseJsonBody<LoginBody>(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      sendJson(res, 400, { error: '邮箱和密码不能为空' });
      return;
    }

    const credential = await findCredentialsByEmail(email);
    if (!credential) {
      sendJson(res, 401, { error: '邮箱或密码错误' });
      return;
    }

    const passOK = verifyPassword(password, credential.passwordHash);
    if (!passOK) {
      sendJson(res, 401, { error: '邮箱或密码错误' });
      return;
    }

    const rawSessionToken = randomToken(32);
    await createAuthSession({
      req,
      res,
      userId: credential.user.id,
      rawToken: rawSessionToken,
    });

    sendJson(res, 200, { ok: true, user: credential.user });
  } catch (error: any) {
    console.error('POST /api/auth/login failed', error);
    sendJson(res, 500, { error: error?.message || '登录失败' });
  }
}
