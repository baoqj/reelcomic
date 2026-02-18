import { buildHashRedirect, getRequestOrigin, randomToken } from '../../../../server/auth/http';
import { readAndValidateOAuthState } from '../../../../server/auth/oauth';
import { createAuthSession } from '../../../../server/auth/session';
import { findOrCreateOAuthUser } from '../../../../server/auth/store';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const requestURL = new URL(req.url, getRequestOrigin(req));
    const code = requestURL.searchParams.get('code');
    const state = requestURL.searchParams.get('state');
    const stateResult = readAndValidateOAuthState({
      req,
      res,
      provider: 'google',
      receivedState: state,
    });

    if (!stateResult.ok || !code) {
      res.writeHead(302, { Location: buildHashRedirect(req, '/auth?error=google_state') });
      res.end();
      return;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI || `${getRequestOrigin(req)}/api/auth/oauth/google/callback`;
    if (!clientId || !clientSecret) {
      throw new Error('Missing Google OAuth env variables');
    }

    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code,
      }).toString(),
    });
    const tokenData = await tokenResp.json();
    if (!tokenResp.ok || !tokenData.access_token) {
      throw new Error('Google token exchange failed');
    }

    const profileResp = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResp.json();
    if (!profileResp.ok || !profile.sub) {
      throw new Error('Google user profile fetch failed');
    }

    const tokenExpiresAt =
      typeof tokenData.expires_in === 'number'
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : undefined;

    const user = await findOrCreateOAuthUser({
      provider: 'google',
      providerUserId: String(profile.sub),
      email: profile.email ? String(profile.email).toLowerCase() : undefined,
      displayName: profile.name ? String(profile.name) : 'Google User',
      avatarUrl: profile.picture ? String(profile.picture) : undefined,
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
    console.error('GET /api/auth/oauth/google/callback failed', error);
    res.writeHead(302, { Location: buildHashRedirect(req, '/auth?error=google_callback') });
    res.end();
  }
}
