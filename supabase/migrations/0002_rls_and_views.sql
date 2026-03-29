alter table public.profiles enable row level security;
alter table public.spores enable row level security;
alter table public.spore_memberships enable row level security;
alter table public.spore_invites enable row level security;
alter table public.check_ins enable row level security;
alter table public.member_observations enable row level security;
alter table public.appreciations enable row level security;
alter table public.activities enable row level security;
alter table public.spore_health_snapshots enable row level security;
alter table public.user_provider_settings enable row level security;
alter table public.passive_signal_events enable row level security;
alter table public.notifications_log enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.rag_memories enable row level security;
alter table public.ai_conversations enable row level security;

create or replace function public.is_spore_member(target_spore_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.spore_memberships
    where spore_id = target_spore_id
      and user_id = auth.uid()
  );
$$;

create policy "profiles_select_self" on public.profiles
for select using (id = auth.uid());

create policy "profiles_update_self" on public.profiles
for update using (id = auth.uid());

create policy "spores_select_member" on public.spores
for select using (public.is_spore_member(id));

create policy "spore_memberships_select_member" on public.spore_memberships
for select using (user_id = auth.uid() or public.is_spore_member(spore_id));

create policy "spore_invites_select_member" on public.spore_invites
for select using (public.is_spore_member(spore_id));

create policy "check_ins_member_rw" on public.check_ins
for all using (public.is_spore_member(spore_id))
with check (public.is_spore_member(spore_id) and member_id = auth.uid());

create policy "observations_member_rw" on public.member_observations
for all using (public.is_spore_member(spore_id))
with check (public.is_spore_member(spore_id) and author_id = auth.uid());

create policy "appreciations_member_rw" on public.appreciations
for all using (public.is_spore_member(spore_id))
with check (public.is_spore_member(spore_id) and author_id = auth.uid());

create policy "activities_member_rw" on public.activities
for all using (public.is_spore_member(spore_id))
with check (public.is_spore_member(spore_id));

create policy "health_member_select" on public.spore_health_snapshots
for select using (public.is_spore_member(spore_id));

create policy "provider_settings_self_rw" on public.user_provider_settings
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "signal_events_self_rw" on public.passive_signal_events
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "notifications_self_select" on public.notifications_log
for select using (user_id = auth.uid());

create policy "push_subscriptions_self_rw" on public.push_subscriptions
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "rag_memories_self_rw" on public.rag_memories
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "ai_conversations_self_rw" on public.ai_conversations
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create or replace view public.v_user_spores as
select
  s.id,
  s.name,
  s.description,
  s.created_at,
  count(distinct sm.user_id) as member_count,
  count(distinct a.id) filter (where a.kind = 'challenge') as challenge_count,
  coalesce((
    select shs.score
    from public.spore_health_snapshots shs
    where shs.spore_id = s.id
    order by shs.created_at desc
    limit 1
  ), 68) as health_score,
  array_agg(distinct p.avatar) filter (where p.avatar is not null) as member_avatars
from public.spores s
join public.spore_memberships sm on sm.spore_id = s.id
join public.profiles p on p.id = sm.user_id
left join public.activities a on a.spore_id = s.id
where sm.user_id = auth.uid() or public.is_spore_member(s.id)
group by s.id;

create or replace view public.passive_provider_status as
select
  provider_key as key,
  case provider_key
    when 'location' then 'Location trends'
    when 'screenTime' then 'Screen time'
    when 'steps' then 'Steps and activity'
    when 'spending' then 'Spending habits'
    else provider_key
  end as label,
  enabled,
  available,
  last_synced_at,
  reason,
  metric_value
from public.user_provider_settings
where user_id = auth.uid();
