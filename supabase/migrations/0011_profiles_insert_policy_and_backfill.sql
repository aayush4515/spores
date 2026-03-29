create policy "profiles_insert_self" on public.profiles
for insert
with check (id = auth.uid());

insert into public.profiles (id, email, display_name, avatar, onboarding_completed)
select
  u.id,
  coalesce(u.email, ''),
  coalesce(u.raw_user_meta_data->>'display_name', split_part(coalesce(u.email, 'member@spores.app'), '@', 1), 'Member'),
  '🌱',
  false
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
