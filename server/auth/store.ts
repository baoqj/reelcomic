import { db } from '../neon';
import { AuthUser } from '../../types';

export type AuthProvider = 'credentials' | 'google' | 'apple';

interface DbUserRow {
  id: string;
  email: string;
  display_name: string;
  avatar_blob_url: string | null;
  role: 'user' | 'admin';
  vip_tier: 'free' | 'vip_monthly' | 'vip_yearly';
}

interface DbCredentialsRow extends DbUserRow {
  password_hash: string;
}

const toAuthUser = (row: DbUserRow): AuthUser => ({
  id: row.id,
  email: row.email,
  displayName: row.display_name,
  avatarUrl: row.avatar_blob_url || undefined,
  isAdmin: row.role === 'admin',
  vipTier: row.vip_tier,
});

export const findUserByEmail = async (email: string): Promise<AuthUser | null> => {
  const rows = (await db`
    select id, email, display_name, avatar_blob_url, role, vip_tier
    from users
    where lower(email) = lower(${email})
    limit 1
  `) as DbUserRow[];
  return rows[0] ? toAuthUser(rows[0]) : null;
};

export const createUser = async (input: {
  email: string;
  displayName: string;
  avatarUrl?: string;
}): Promise<AuthUser> => {
  const rows = (await db`
    insert into users (email, display_name, avatar_blob_url, role, vip_tier)
    values (${input.email}, ${input.displayName}, ${input.avatarUrl || null}, 'user', 'free')
    returning id, email, display_name, avatar_blob_url, role, vip_tier
  `) as DbUserRow[];
  return toAuthUser(rows[0]);
};

export const upsertCredentials = async (userId: string, passwordHash: string) => {
  await db`
    insert into auth_credentials (user_id, password_hash)
    values (${userId}, ${passwordHash})
    on conflict (user_id)
    do update set
      password_hash = excluded.password_hash,
      updated_at = now()
  `;
};

export const findCredentialsByEmail = async (
  email: string,
): Promise<{ user: AuthUser; passwordHash: string } | null> => {
  const rows = (await db`
    select
      u.id,
      u.email,
      u.display_name,
      u.avatar_blob_url,
      u.role,
      u.vip_tier,
      c.password_hash
    from users u
    inner join auth_credentials c on c.user_id = u.id
    where lower(u.email) = lower(${email})
    limit 1
  `) as DbCredentialsRow[];
  if (!rows[0]) return null;
  return {
    user: toAuthUser(rows[0]),
    passwordHash: rows[0].password_hash,
  };
};

export const linkProviderAccount = async (input: {
  userId: string;
  provider: AuthProvider;
  providerUserId: string;
  providerEmail?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
}) => {
  await db`
    insert into auth_accounts
      (user_id, provider, provider_user_id, provider_email, access_token, refresh_token, token_expires_at)
    values
      (${input.userId}, ${input.provider}, ${input.providerUserId}, ${input.providerEmail || null}, ${input.accessToken || null}, ${input.refreshToken || null}, ${input.tokenExpiresAt || null})
    on conflict (provider, provider_user_id)
    do update set
      user_id = excluded.user_id,
      provider_email = excluded.provider_email,
      access_token = excluded.access_token,
      refresh_token = excluded.refresh_token,
      token_expires_at = excluded.token_expires_at,
      updated_at = now()
  `;
};

export const findUserByProvider = async (
  provider: AuthProvider,
  providerUserId: string,
): Promise<AuthUser | null> => {
  const rows = (await db`
    select
      u.id,
      u.email,
      u.display_name,
      u.avatar_blob_url,
      u.role,
      u.vip_tier
    from auth_accounts a
    inner join users u on u.id = a.user_id
    where a.provider = ${provider}
      and a.provider_user_id = ${providerUserId}
    limit 1
  `) as DbUserRow[];
  return rows[0] ? toAuthUser(rows[0]) : null;
};

export const createSession = async (input: {
  userId: string;
  sessionTokenHash: string;
  expiresAtISO: string;
  ipAddress?: string;
  userAgent?: string;
}) => {
  await db`
    insert into auth_sessions (user_id, session_token_hash, expires_at, ip_address, user_agent)
    values (${input.userId}, ${input.sessionTokenHash}, ${input.expiresAtISO}, ${input.ipAddress || null}, ${input.userAgent || null})
  `;
};

export const findUserBySessionTokenHash = async (tokenHash: string): Promise<AuthUser | null> => {
  const rows = (await db`
    select
      u.id,
      u.email,
      u.display_name,
      u.avatar_blob_url,
      u.role,
      u.vip_tier
    from auth_sessions s
    inner join users u on u.id = s.user_id
    where s.session_token_hash = ${tokenHash}
      and s.revoked_at is null
      and s.expires_at > now()
    limit 1
  `) as DbUserRow[];
  return rows[0] ? toAuthUser(rows[0]) : null;
};

export const revokeSessionByTokenHash = async (tokenHash: string) => {
  await db`
    update auth_sessions
    set revoked_at = now()
    where session_token_hash = ${tokenHash}
      and revoked_at is null
  `;
};

export const findOrCreateOAuthUser = async (input: {
  provider: 'google' | 'apple';
  providerUserId: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
}) => {
  const existingByProvider = await findUserByProvider(input.provider, input.providerUserId);
  if (existingByProvider) {
    await linkProviderAccount({
      userId: existingByProvider.id,
      provider: input.provider,
      providerUserId: input.providerUserId,
      providerEmail: input.email,
      accessToken: input.accessToken,
      refreshToken: input.refreshToken,
      tokenExpiresAt: input.tokenExpiresAt,
    });
    return existingByProvider;
  }

  const normalizedEmail =
    input.email || `${input.provider}_${input.providerUserId}@oauth.reelcomic.local`;
  const existingByEmail = await findUserByEmail(normalizedEmail);

  const user =
    existingByEmail ||
    (await createUser({
      email: normalizedEmail,
      displayName: input.displayName || `${input.provider.toUpperCase()} User`,
      avatarUrl: input.avatarUrl,
    }));

  await linkProviderAccount({
    userId: user.id,
    provider: input.provider,
    providerUserId: input.providerUserId,
    providerEmail: input.email,
    accessToken: input.accessToken,
    refreshToken: input.refreshToken,
    tokenExpiresAt: input.tokenExpiresAt,
  });

  return user;
};
