import {
  buildHashRedirect,
  getRequestOrigin,
  parseJsonBody,
  randomToken,
} from '../../../../server/auth/http';
import {
  createAppleClientSecret,
  decodeJwtPayload,
  readAndValidateOAuthState,
} from '../../../../server/auth/oauth';
import { createAuthSession } from '../../../../server/auth/session';
import { findOrCreateOAuthUser } from '../../../../server/auth/store';

interface AppleIDTokenPayload {
  sub: string;
  email?: string;
  email_verified?: boolean | string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const requestURL = new URL(req.url, getRequestOrigin(req));
    let code = requestURL.searchParams.get('code');
    let state = requestURL.searchParams.get('state');
    if (!code && req.method === 'POST') {
      const body = await parseJsonBody<Record<string, string>>(req);
      code = body.code || null;
      state = body.state || null;
    }

    const stateResult = readAndValidateOAuthState({
      req,
      res,
      provider: 'apple',
      receivedState: state,
    });
    if (!stateResult.ok || !code) {
      res.writeHead(302, { Location: buildHashRedirect(req, '/auth?error=apple_state') });
      res.end();
      return;
    }

    const clientId = process.env.APPLE_CLIENT_ID;
    const redirectUri =
      process.env.APPLE_REDIRECT_URI || `${getRequestOrigin(req)}/api/auth/oauth/apple/callback`;
    if (!clientId) throw new Error('APPLE_CLIENT_ID missing');

    const tokenResp = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: createAppleClientSecret(),
        redirect_uri: redirectUri,
      }).toString(),
    });
    const tokenData = await tokenResp.json();
    if (!tokenResp.ok || !tokenData.id_token) {
      throw new Error('Apple token exchange failed');
    }

    const idTokenPayload = decodeJwtPayload<AppleIDTokenPayload>(tokenData.id_token);
    if (!idTokenPayload.sub) {
      throw new Error('Apple id_token missing sub');
    }

    const normalizedEmail = idTokenPayload.email
      ? String(idTokenPayload.email).toLowerCase()
      : undefined;
    const tokenExpiresAt =
      typeof tokenData.expires_in === 'number'
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : undefined;

    const user = await findOrCreateOAuthUser({
      provider: 'apple',
      providerUserId: String(idTokenPayload.sub),
      email: normalizedEmail,
      displayName: normalizedEmail ? normalizedEmail.split('@')[0] : 'Apple User',
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiresAt,
    });

    await createAuthSession({
      req,
      res,
      userId: user.id,
      rawToken: randomToken(32),
    });

    res.writeHead(302, { Location: buildHashRedirect(req, stateResult.nextPath) });
    res.end();
  } catch (error) {
    console.error('GET/POST /api/auth/oauth/apple/callback failed', error);
    res.writeHead(302, { Location: buildHashRedirect(req, '/auth?error=apple_callback') });
    res.end();
  }
}
