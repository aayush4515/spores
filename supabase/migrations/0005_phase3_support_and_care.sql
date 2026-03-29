create or replace function public.log_support_activity(
  target_spore_id uuid,
  activity_type text,
  target_member uuid,
  content text
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.notifications_log (user_id, spore_id, title, body, kind, metadata)
  values (
    target_member,
    target_spore_id,
    case when activity_type = 'observation' then 'Observation logged' else 'Support received' end,
    content,
    'server',
    jsonb_build_object('type', activity_type)
  );
end;
$$;

create or replace function public.fetch_member_care_snapshot(in_spore_id uuid, in_member_id uuid)
returns jsonb
language sql
stable
as $$
  with member_profile as (
    select
      p.id,
      p.display_name,
      p.avatar,
      p.support_preferences,
      (
        select c.mood
        from public.check_ins c
        where c.member_id = in_member_id
        order by c.created_at desc
        limit 1
      ) as latest_mood
    from public.profiles p
    where p.id = in_member_id
  ),
  support_counts as (
    select
      (
        select count(*)
        from public.appreciations a
        where a.spore_id = in_spore_id
          and a.target_member_id = in_member_id
      ) as appreciation_count,
      (
        select count(*)
        from public.member_observations o
        where o.spore_id = in_spore_id
          and o.target_member_id = in_member_id
      ) as observation_count
  ),
  feedback_history as (
    select coalesce(
      jsonb_agg(entry order by created_at desc),
      '[]'::jsonb
    ) as items
    from (
      select
        jsonb_build_object(
          'id', a.id,
          'sporeId', a.spore_id,
          'type', 'appreciation',
          'memberId', a.author_id,
          'memberName', p.display_name,
          'content', a.message,
          'timestampLabel', to_char(a.created_at, 'Mon DD'),
          'createdAt', a.created_at
        ) as entry,
        a.created_at
      from public.appreciations a
      join public.profiles p on p.id = a.author_id
      where a.spore_id = in_spore_id
        and a.target_member_id = in_member_id
      union all
      select
        jsonb_build_object(
          'id', o.id,
          'sporeId', o.spore_id,
          'type', 'observation',
          'memberId', o.author_id,
          'memberName', p.display_name,
          'content', coalesce(o.note, o.label),
          'timestampLabel', to_char(o.created_at, 'Mon DD'),
          'createdAt', o.created_at
        ) as entry,
        o.created_at
      from public.member_observations o
      join public.profiles p on p.id = o.author_id
      where o.spore_id = in_spore_id
        and o.target_member_id = in_member_id
    ) combined
  )
  select jsonb_build_object(
    'member', jsonb_build_object(
      'id', mp.id,
      'displayName', mp.display_name,
      'avatar', mp.avatar,
      'supportPreferences', mp.support_preferences,
      'mood', mp.latest_mood,
      'status', 'okay',
      'lastSeenLabel', 'recently'
    ),
    'supportCount', coalesce(sc.appreciation_count, 0) + coalesce(sc.observation_count, 0),
    'lastCheckInLabel', coalesce((
      select to_char(created_at, 'Mon DD')
      from public.check_ins
      where member_id = in_member_id
      order by created_at desc
      limit 1
    ), 'No recent check-in'),
    'activeChallenges', (
      select count(*)
      from public.activities
      where spore_id = in_spore_id
        and in_member_id = any(participant_ids)
    ),
    'feedbackHistory', fh.items
  )
  from member_profile mp
  left join support_counts sc on true
  left join feedback_history fh on true;
$$;
