import { randomBytes } from 'crypto';

export const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [name, ...rest] = part.trim().split('=');
    if (!name) return acc;
    acc[name] = decodeURIComponent(rest.join('=') || '');
    return acc;
  }, {});
};

export const serializeCookie = (
  name: string,
  value: string,
  options: {
    maxAge?: number;
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'Lax' | 'Strict' | 'None';
  } = {},
) => {
  const segments = [`${name}=${encodeURIComponent(value)}`];
  segments.push(`Path=${options.path || '/'}`);
  if (typeof options.maxAge === 'number') segments.push(`Max-Age=${options.maxAge}`);
  if (options.httpOnly !== false) segments.push('HttpOnly');
  if (options.secure) segments.push('Secure');
  segments.push(`SameSite=${options.sameSite || 'Lax'}`);
  return segments.join('; ');
};

export const appendSetCookie = (res: any, cookie: string) => {
  const existing = res.getHeader('Set-Cookie');
  if (!existing) {
    res.setHeader('Set-Cookie', cookie);
    return;
  }
  if (Array.isArray(existing)) {
    res.setHeader('Set-Cookie', [...existing, cookie]);
    return;
  }
  res.setHeader('Set-Cookie', [String(existing), cookie]);
};

export const getRequestOrigin = (req: any) => {
  const xfProto = req.headers?.['x-forwarded-proto'];
  const xfHost = req.headers?.['x-forwarded-host'];
  const host = xfHost || req.headers?.host || 'localhost:3000';
  const proto = xfProto || 'http';
  return `${proto}://${host}`;
};

export const getAppBaseUrl = (req: any) => process.env.APP_BASE_URL || getRequestOrigin(req);

export const isSecureCookieRequest = (req: any) => {
  if (process.env.NODE_ENV === 'production') return true;
  return req.headers?.['x-forwarded-proto'] === 'https';
};

export const parseJsonBody = async <T = Record<string, any>>(req: any): Promise<T> => {
  if (req.body && typeof req.body === 'object') return req.body as T;
  if (typeof req.body === 'string') return JSON.parse(req.body) as T;
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {} as T;
  const contentType = String(req.headers?.['content-type'] || '');
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw);
    const obj: Record<string, string> = {};
    params.forEach((value, key) => {
      obj[key] = value;
    });
    return obj as T;
  }
  return JSON.parse(raw) as T;
};

export const randomToken = (size = 32) => randomBytes(size).toString('hex');

export const sanitizeNextPath = (value?: string | null) => {
  if (!value) return '/profile';
  if (!value.startsWith('/') || value.startsWith('//')) return '/profile';
  return value;
};

export const buildHashRedirect = (req: any, nextPath?: string) => {
  const base = getAppBaseUrl(req);
  const safePath = sanitizeNextPath(nextPath);
  return `${base}/#${safePath}`;
};

export const sendJson = (res: any, statusCode: number, payload: unknown) => {
  res.status(statusCode).json(payload);
};
