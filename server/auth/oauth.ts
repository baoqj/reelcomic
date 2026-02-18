import { createPrivateKey, createSign } from 'crypto';
import {
  appendSetCookie,
  isSecureCookieRequest,
  parseCookies,
  serializeCookie,
  sanitizeNextPath,
} from './http';

type Provider = 'google' | 'apple';

const STATE_COOKIE_PREFIX = 'reelcomic_oauth_state_';
const STATE_COOKIE_TTL_SECONDS = 60 * 10;

const toBase64Url = (value: string | Buffer) =>
  Buffer.from(value).toString('base64url');

const writeOAuthStateCookie = (
  req: any,
  res: any,
  provider: Provider,
  state: string,
  nextPath: string,
) => {
  const cookieValue = `${state}|${encodeURIComponent(nextPath)}`;
  appendSetCookie(
    res,
    serializeCookie(`${STATE_COOKIE_PREFIX}${provider}`, cookieValue, {
      maxAge: STATE_COOKIE_TTL_SECONDS,
      path: '/',
      secure: isSecureCookieRequest(req),
      httpOnly: true,
      sameSite: 'Lax',
    }),
  );
};

const clearOAuthStateCookie = (req: any, res: any, provider: Provider) => {
  appendSetCookie(
    res,
    serializeCookie(`${STATE_COOKIE_PREFIX}${provider}`, '', {
      maxAge: 0,
      path: '/',
      secure: isSecureCookieRequest(req),
      httpOnly: true,
      sameSite: 'Lax',
    }),
  );
};

export const setOAuthState = (input: {
  req: any;
  res: any;
  provider: Provider;
  state: string;
  nextPath?: string | null;
}) => {
  const next = sanitizeNextPath(input.nextPath);
  writeOAuthStateCookie(input.req, input.res, input.provider, input.state, next);
};

export const readAndValidateOAuthState = (input: {
  req: any;
  res: any;
  provider: Provider;
  receivedState?: string | null;
}) => {
  const cookies = parseCookies(input.req.headers?.cookie);
  const raw = cookies[`${STATE_COOKIE_PREFIX}${input.provider}`];
  clearOAuthStateCookie(input.req, input.res, input.provider);
  if (!raw || !input.receivedState) return { ok: false as const, nextPath: '/profile' };
  const [savedState, encodedNext] = raw.split('|');
  if (!savedState || savedState !== input.receivedState) {
    return { ok: false as const, nextPath: '/profile' };
  }
  const nextPath = sanitizeNextPath(encodedNext ? decodeURIComponent(encodedNext) : '/profile');
  return { ok: true as const, nextPath };
};

export const createAppleClientSecret = () => {
  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const clientId = process.env.APPLE_CLIENT_ID;
  const privateKeyRaw = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!teamId || !keyId || !clientId || !privateKeyRaw) {
    throw new Error('Missing Apple OAuth env variables');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = toBase64Url(JSON.stringify({ alg: 'ES256', kid: keyId, typ: 'JWT' }));
  const payload = toBase64Url(
    JSON.stringify({
      iss: teamId,
      iat: now,
      exp: now + 60 * 60 * 24 * 180,
      aud: 'https://appleid.apple.com',
      sub: clientId,
    }),
  );
  const unsigned = `${header}.${payload}`;
  const signer = createSign('SHA256');
  signer.update(unsigned);
  signer.end();
  const privateKey = createPrivateKey(privateKeyRaw);
  const signature = signer.sign({ key: privateKey, dsaEncoding: 'ieee-p1363' });
  return `${unsigned}.${toBase64Url(signature)}`;
};

export const decodeJwtPayload = <T = Record<string, any>>(jwt: string): T => {
  const parts = jwt.split('.');
  if (parts.length < 2) throw new Error('Invalid JWT');
  const payloadRaw = Buffer.from(parts[1], 'base64url').toString('utf8');
  return JSON.parse(payloadRaw) as T;
};
