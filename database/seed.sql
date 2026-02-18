insert into subscription_plans (code, title, billing_cycle, amount_cents)
values
  ('vip_monthly', 'VIP Monthly', 'monthly', 999),
  ('vip_yearly', 'VIP Yearly', 'yearly', 9599)
on conflict (code) do update set
  title = excluded.title,
  billing_cycle = excluded.billing_cycle,
  amount_cents = excluded.amount_cents,
  updated_at = now();
