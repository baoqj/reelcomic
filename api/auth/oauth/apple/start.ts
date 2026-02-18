import { getRequestOrigin, randomToken, sanitizeNextPath } from '../../../../server/auth/http';
import { setOAuthState } from '../../../../server/auth/oauth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const clientId = process.env.APPLE_CLIENT_ID;
  const redirectUri =
    process.env.APPLE_REDIRECT_URI || `${getRequestOrigin(req)}/api/auth/oauth/apple/callback`;
  if (!clientId) {
    res.status(500).json({ error: 'APPLE_CLIENT_ID is missing' });
    return;
  }

  const url = new URL(req.url, getRequestOrigin(req));
  const nextPath = sanitizeNextPath(url.searchParams.get('next'));
  const state = randomToken(16);
  setOAuthState({ req, res, provider: 'apple', state, nextPath });

  const authUrl = new URL('https://appleid.apple.com/auth/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('response_mode', 'query');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'name email');
  authUrl.searchParams.set('state', state);

  res.writeHead(302, { Location: authUrl.toString() });
  res.end();
}
