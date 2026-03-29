insert into public.profiles (id, email, display_name, avatar, onboarding_completed, support_preferences)
values
  ('00000000-0000-0000-0000-000000000001', 'hello@spores.app', 'Aayush', '🌱', true, array['gentle reminders', 'check-in messages', 'quiet support']),
  ('00000000-0000-0000-0000-000000000002', 'maya@spores.app', 'Maya', '🌸', true, array['words of affirmation', 'active listening']),
  ('00000000-0000-0000-0000-000000000003', 'jordan@spores.app', 'Jordan', '🌿', true, array['space', 'practical help']),
  ('00000000-0000-0000-0000-000000000004', 'sam@spores.app', 'Sam', '🍃', true, array['shared activities', 'check-ins'])
on conflict (id) do nothing;

insert into public.spores (id, created_by, name, description)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Inner Circle', 'Your closest support space')
on conflict (id) do nothing;

insert into public.spore_memberships (spore_id, user_id, role)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'owner'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'member')
on conflict do nothing;

update public.profiles
set active_spore_id = '10000000-0000-0000-0000-000000000001'
where id = '00000000-0000-0000-0000-000000000001';

insert into public.activities (
  id, spore_id, kind, title, description, icon, category, duration_label, participant_ids, completed_by_ids, created_by, ends_at
)
values
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'challenge',
    'Morning walk',
    'Take a 10-minute walk outside each morning',
    '🚶',
    'activity',
    '7 days',
    array['00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000004'::uuid],
    array['00000000-0000-0000-0000-000000000002'::uuid],
    '00000000-0000-0000-0000-000000000002',
    now() + interval '7 days'
  )
on conflict (id) do nothing;

insert into public.spore_health_snapshots (spore_id, score, baseline, activity_bonus, feedback_penalty, summary)
values
  ('10000000-0000-0000-0000-000000000001', 72, 60, 12, 0, 'Your Spore has a warm, steady rhythm.')
on conflict do nothing;
