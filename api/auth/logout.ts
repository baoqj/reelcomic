import { sendJson } from '../../server/auth/http';
import { clearAuthSession } from '../../server/auth/session';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    await clearAuthSession(req, res);
    sendJson(res, 200, { ok: true });
  } catch (error: any) {
    console.error('POST /api/auth/logout failed', error);
    sendJson(res, 500, { error: error?.message || '退出失败' });
  }
}
