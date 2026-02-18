import { sendJson } from '../../server/auth/http';
import { readAuthUserFromRequest } from '../../server/auth/session';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const user = await readAuthUserFromRequest(req);
    if (!user) {
      sendJson(res, 200, { authenticated: false, user: null });
      return;
    }
    sendJson(res, 200, { authenticated: true, user });
  } catch (error: any) {
    console.error('GET /api/auth/session failed', error);
    sendJson(res, 200, { authenticated: false, user: null });
  }
}
