create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text not null,
  avatar text not null default '🌱',
  onboarding_completed boolean not null default false,
  active_spore_id uuid,
  support_phone text default '',
  support_preferences text[] not null default '{}',
  consent jsonb not null default '{"locationSignals": true, "screenTimeSignals": false, "spendingSignals": false, "aiMemory": true, "supportSharing": true, "crisisSupport": true}'::jsonb,
  notification_preferences jsonb not null default '{"dailyCheckIn": true, "careAlerts": true, "challengeUpdates": true, "aiFollowUps": true, "pushEnabled": false}'::jsonb,
  feature_flags jsonb not null default '{"multiSpore": true, "activities": true, "passiveTracking": true, "rag": true, "aiAgent": true, "serverNotifications": true, "demoMode": false}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spores (
  id uuid primary key default gen_random_uuid(),
  created_by uuid,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.spore_memberships (
  id uuid primary key default gen_random_uuid(),
  spore_id uuid not null references public.spores(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  consent_status text not null default 'accepted',
  joined_at timestamptz not null default now(),
  unique (spore_id, user_id)
);

create table if not exists public.spore_invites (
  id uuid primary key default gen_random_uuid(),
  spore_id uuid not null references public.spores(id) on delete cascade,
  invite_code text not null unique,
  email text,
  invited_by uuid references public.profiles(id) on delete set null,
  accepted_by uuid references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  spore_id uuid not null references public.spores(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  mood int not null check (mood between 0 and 10),
  energy int not null check (energy between 0 and 10),
  stress int not null check (stress between 0 and 10),
  sleep int not null check (sleep between 0 and 10),
  social_battery int not null check (social_battery between 0 and 10),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.member_observations (
  id uuid primary key default gen_random_uuid(),
  spore_id uuid not null references public.spores(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  target_member_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  severity text not null,
  confidence text not null default 'somewhat',
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.appreciations (
  id uuid primary key default gen_random_uuid(),
  spore_id uuid not null references public.spores(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  target_member_id uuid not null references public.profiles(id) on delete cascade,
  icon text not null default '💚',
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  spore_id uuid not null references public.spores(id) on delete cascade,
  kind text not null default 'challenge',
  title text not null,
  description text not null default '',
  icon text not null default '✨',
  category text not null default 'wellness',
  duration_label text not null default '7 days',
  participant_ids uuid[] not null default '{}',
  completed_by_ids uuid[] not null default '{}',
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  ends_at timestamptz
);

create table if not exists public.spore_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  spore_id uuid not null references public.spores(id) on delete cascade,
  score int not null,
  baseline int not null,
  activity_bonus int not null default 0,
  feedback_penalty int not null default 0,
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_provider_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider_key text not null,
  enabled boolean not null default false,
  available boolean not null default false,
  reason text,
  last_synced_at timestamptz,
  metric_value numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider_key)
);

create table if not exists public.passive_signal_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  spore_id uuid references public.spores(id) on delete set null,
  provider_key text not null,
  metric_name text not null,
  metric_value numeric not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  spore_id uuid references public.spores(id) on delete set null,
  title text not null,
  body text not null,
  kind text not null default 'server',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  expo_push_token text not null unique,
  device_platform text not null default 'ios',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rag_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  spore_id uuid references public.spores(id) on delete cascade,
  source_type text not null default 'signal',
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  spore_id uuid references public.spores(id) on delete cascade,
  role text not null,
  content text not null,
  concern_band text not null default 'steady',
  citations text[] not null default '{}',
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists provider_settings_touch_updated_at on public.user_provider_settings;
create trigger provider_settings_touch_updated_at before update on public.user_provider_settings
for each row execute function public.touch_updated_at();

drop trigger if exists push_subscriptions_touch_updated_at on public.push_subscriptions;
create trigger push_subscriptions_touch_updated_at before update on public.push_subscriptions
for each row execute function public.touch_updated_at();
