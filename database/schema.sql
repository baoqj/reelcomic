-- ReelComic schema for Neon Postgres
-- Compatible with PostgreSQL 15+ (Neon default)

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  display_name text not null,
  avatar_blob_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  vip_tier text not null default 'free' check (vip_tier in ('free', 'vip_monthly', 'vip_yearly')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists users_email_unique_idx on users ((lower(email)));

create table if not exists auth_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  provider text not null check (provider in ('credentials', 'google', 'apple')),
  provider_user_id text not null,
  provider_email text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_user_id),
  unique (user_id, provider)
);

create index if not exists auth_accounts_user_idx on auth_accounts(user_id);
create index if not exists auth_accounts_provider_email_idx on auth_accounts(provider, lower(provider_email));

create table if not exists auth_credentials (
  user_id uuid primary key references users(id) on delete cascade,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists auth_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  session_token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists auth_sessions_user_idx on auth_sessions(user_id, created_at desc);
create index if not exists auth_sessions_active_idx on auth_sessions(expires_at, revoked_at);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists series (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  synopsis text not null,
  status text not null default 'ongoing' check (status in ('ongoing', 'completed', 'archived')),
  release_year smallint not null check (release_year between 2000 and 2100),
  total_episodes int not null default 0 check (total_episodes >= 0),
  cover_blob_url text,
  poster_blob_url text,
  average_rating numeric(3, 2) not null default 0,
  view_count bigint not null default 0,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists series_tags (
  series_id uuid not null references series(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (series_id, tag_id)
);

create table if not exists episodes (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references series(id) on delete cascade,
  episode_no int not null check (episode_no > 0),
  title text not null,
  synopsis text,
  duration_seconds int not null check (duration_seconds between 30 and 240),
  mux_asset_id text,
  mux_playback_id text,
  stream_status text not null default 'processing' check (stream_status in ('processing', 'ready', 'errored')),
  thumbnail_blob_url text,
  subtitle_blob_url text,
  is_vip_only boolean not null default true,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (series_id, episode_no)
);

create index if not exists episodes_series_idx on episodes(series_id, episode_no);
create index if not exists episodes_mux_playback_idx on episodes(mux_playback_id);

create table if not exists watch_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  series_id uuid not null references series(id) on delete cascade,
  episode_id uuid not null references episodes(id) on delete cascade,
  progress_seconds int not null default 0 check (progress_seconds >= 0),
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, episode_id)
);

create index if not exists watch_progress_user_series_idx on watch_progress(user_id, series_id);

create table if not exists subscription_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  amount_cents int not null check (amount_cents > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  plan_id uuid not null references subscription_plans(id),
  status text not null check (status in ('active', 'trialing', 'past_due', 'canceled', 'expired')),
  started_at timestamptz not null,
  expires_at timestamptz not null,
  auto_renew boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_status_idx on subscriptions(user_id, status, expires_at desc);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references subscriptions(id) on delete set null,
  user_id uuid not null references users(id) on delete cascade,
  provider text not null default 'vercel_checkout',
  provider_txn_id text,
  amount_cents int not null check (amount_cents > 0),
  currency text not null default 'USD',
  status text not null check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references users(id) on delete set null,
  series_id uuid references series(id) on delete cascade,
  episode_id uuid references episodes(id) on delete cascade,
  storage_provider text not null check (storage_provider in ('vercel_blob', 'mux')),
  asset_type text not null check (asset_type in ('poster', 'still', 'subtitle', 'terms_pdf', 'marketing', 'video')),
  blob_url text,
  mux_asset_id text,
  mime_type text,
  size_bytes bigint,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists assets_series_idx on assets(series_id);
create index if not exists assets_episode_idx on assets(episode_id);

create table if not exists admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references users(id) on delete cascade,
  action text not null,
  target_type text not null,
  target_id text,
  payload jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists series_metrics_daily (
  id uuid primary key default gen_random_uuid(),
  metric_date date not null,
  series_id uuid not null references series(id) on delete cascade,
  new_viewers int not null default 0,
  total_watch_minutes int not null default 0,
  revenue_cents int not null default 0,
  created_at timestamptz not null default now(),
  unique (metric_date, series_id)
);

drop trigger if exists users_set_updated_at on users;
create trigger users_set_updated_at
before update on users
for each row execute function set_updated_at();

drop trigger if exists auth_accounts_set_updated_at on auth_accounts;
create trigger auth_accounts_set_updated_at
before update on auth_accounts
for each row execute function set_updated_at();

drop trigger if exists auth_credentials_set_updated_at on auth_credentials;
create trigger auth_credentials_set_updated_at
before update on auth_credentials
for each row execute function set_updated_at();

drop trigger if exists series_set_updated_at on series;
create trigger series_set_updated_at
before update on series
for each row execute function set_updated_at();

drop trigger if exists episodes_set_updated_at on episodes;
create trigger episodes_set_updated_at
before update on episodes
for each row execute function set_updated_at();

drop trigger if exists watch_progress_set_updated_at on watch_progress;
create trigger watch_progress_set_updated_at
before update on watch_progress
for each row execute function set_updated_at();

drop trigger if exists subscription_plans_set_updated_at on subscription_plans;
create trigger subscription_plans_set_updated_at
before update on subscription_plans
for each row execute function set_updated_at();

drop trigger if exists subscriptions_set_updated_at on subscriptions;
create trigger subscriptions_set_updated_at
before update on subscriptions
for each row execute function set_updated_at();
