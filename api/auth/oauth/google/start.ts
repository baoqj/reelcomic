import { randomToken, getRequestOrigin, sanitizeNextPath } from '../../../../server/auth/http';
import { setOAuthState } from '../../../../server/auth/oauth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${getRequestOrigin(req)}/api/auth/oauth/google/callback`;
  if (!clientId) {
    res.status(500).json({ error: 'GOOGLE_CLIENT_ID is missing' });
    return;
  }

  const url = new URL(req.url, getRequestOrigin(req));
  const nextPath = sanitizeNextPath(url.searchParams.get('next'));
  const state = randomToken(16);
  setOAuthState({ req, res, provider: 'google', state, nextPath });

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'select_account');

  res.writeHead(302, { Location: authUrl.toString() });
  res.end();
}
