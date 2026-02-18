import { AuthUser } from '../../types';
import {
  appendSetCookie,
  isSecureCookieRequest,
  parseCookies,
  serializeCookie,
} from './http';
import { hashSessionToken } from './password';
import { createSession, findUserBySessionTokenHash, revokeSessionByTokenHash } from './store';

export const SESSION_COOKIE_NAME = 'reelcomic_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

const sessionCookieOptions = (req: any) => ({
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
  secure: isSecureCookieRequest(req),
  httpOnly: true,
  sameSite: 'Lax' as const,
});

export const createAuthSession = async (input: {
  req: any;
  res: any;
  userId: string;
  rawToken: string;
}) => {
  const tokenHash = hashSessionToken(input.rawToken);
  const expiresAtISO = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  await createSession({
    userId: input.userId,
    sessionTokenHash: tokenHash,
    expiresAtISO,
    ipAddress: input.req.headers?.['x-forwarded-for'] || input.req.socket?.remoteAddress,
    userAgent: input.req.headers?.['user-agent'],
  });
  appendSetCookie(
    input.res,
    serializeCookie(SESSION_COOKIE_NAME, input.rawToken, sessionCookieOptions(input.req)),
  );
};

export const readAuthUserFromRequest = async (req: any): Promise<AuthUser | null> => {
  const cookies = parseCookies(req.headers?.cookie);
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) return null;
  const tokenHash = hashSessionToken(token);
  return findUserBySessionTokenHash(tokenHash);
};

export const clearAuthSession = async (req: any, res: any) => {
  const cookies = parseCookies(req.headers?.cookie);
  const token = cookies[SESSION_COOKIE_NAME];
  if (token) {
    await revokeSessionByTokenHash(hashSessionToken(token));
  }
  appendSetCookie(
    res,
    serializeCookie(SESSION_COOKIE_NAME, '', {
      path: '/',
      maxAge: 0,
      secure: isSecureCookieRequest(req),
      httpOnly: true,
      sameSite: 'Lax',
    }),
  );
};
