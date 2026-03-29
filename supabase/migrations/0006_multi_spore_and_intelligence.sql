create or replace function public.compute_spore_health_snapshot(target_spore_id uuid)
returns public.spore_health_snapshots
language plpgsql
security definer
as $$
declare
  baseline int;
  activity_bonus int;
  feedback_penalty int;
  score int;
  summary text;
  snapshot public.spore_health_snapshots;
begin
  select coalesce(round(avg((mood + energy + sleep) / 3.0) * 10), 60)::int
  into baseline
  from public.check_ins
  where spore_id = target_spore_id
    and created_at >= now() - interval '14 days';

  select least(count(*) * 2, 20)::int
  into activity_bonus
  from public.activities
  where spore_id = target_spore_id
    and cardinality(completed_by_ids) > 0
    and created_at >= now() - interval '14 days';

  select least(count(*) * 3, 15)::int
  into feedback_penalty
  from public.member_observations
  where spore_id = target_spore_id
    and severity = 'moderate'
    and created_at >= now() - interval '14 days';

  baseline := coalesce(baseline, 60);
  activity_bonus := coalesce(activity_bonus, 0);
  feedback_penalty := coalesce(feedback_penalty, 0);
  score := greatest(0, least(100, baseline + activity_bonus - feedback_penalty));
  summary := case
    when score >= 80 then 'Your Spore has a warm, steady rhythm.'
    when score >= 65 then 'Your Spore is holding together with room for more care.'
    else 'Your Spore could use more gentle support this week.'
  end;

  insert into public.spore_health_snapshots (spore_id, score, baseline, activity_bonus, feedback_penalty, summary)
  values (target_spore_id, score, baseline, activity_bonus, feedback_penalty, summary)
  returning * into snapshot;

  return snapshot;
end;
$$;

create or replace function public.join_activity(target_activity_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.activities
  set participant_ids = array(select distinct unnest(participant_ids || auth.uid()))
  where id = target_activity_id;
end;
$$;

create or replace function public.complete_activity(target_activity_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  target_spore_id uuid;
  snapshot public.spore_health_snapshots;
begin
  update public.activities
  set completed_by_ids = array(select distinct unnest(completed_by_ids || auth.uid()))
  where id = target_activity_id
  returning spore_id into target_spore_id;

  select * into snapshot from public.compute_spore_health_snapshot(target_spore_id);

  return jsonb_build_object(
    'sporeId', target_spore_id,
    'health', row_to_json(snapshot)
  );
end;
$$;

create or replace function public.fetch_spore_detail(target_spore_id uuid)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'summary', (
      select row_to_json(v)
      from public.v_user_spores v
      where v.id = target_spore_id
      limit 1
    ),
    'health', (
      select row_to_json(h)
      from public.spore_health_snapshots h
      where h.spore_id = target_spore_id
      order by h.created_at desc
      limit 1
    ),
    'members', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'displayName', p.display_name,
          'avatar', p.avatar,
          'status', 'okay',
          'lastSeenLabel', 'recently',
          'supportPreferences', p.support_preferences
        )
      )
      from public.spore_memberships sm
      join public.profiles p on p.id = sm.user_id
      where sm.spore_id = target_spore_id
    ), '[]'::jsonb),
    'activities', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'sporeId', a.spore_id,
          'type', 'challenge-created',
          'memberId', a.created_by,
          'memberName', p.display_name,
          'content', a.title,
          'timestampLabel', to_char(a.created_at, 'Mon DD'),
          'createdAt', a.created_at
        )
      )
      from public.activities a
      join public.profiles p on p.id = a.created_by
      where a.spore_id = target_spore_id
    ), '[]'::jsonb),
    'challenges', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'sporeId', a.spore_id,
          'title', a.title,
          'description', a.description,
          'icon', a.icon,
          'category', a.category,
          'durationLabel', a.duration_label,
          'participantIds', a.participant_ids,
          'completedByIds', a.completed_by_ids,
          'createdBy', a.created_by,
          'createdAt', a.created_at,
          'endsAt', a.ends_at
        )
      )
      from public.activities a
      where a.spore_id = target_spore_id
        and a.kind = 'challenge'
    ), '[]'::jsonb)
  );
$$;

create or replace function public.fetch_home_summary(target_spore_id uuid)
returns jsonb
language sql
stable
as $$
  with active_spore as (
    select * from public.v_user_spores where id = target_spore_id limit 1
  )
  select jsonb_build_object(
    'greeting', 'Welcome back',
    'careScore', coalesce((select health_score from active_spore), 68),
    'currentSpore', (select row_to_json(a) from active_spore a),
    'passiveTrends', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'key', provider_key,
          'label', case provider_key when 'location' then 'Movement rhythm' when 'steps' then 'Daily steps' when 'screenTime' then 'Screen time' else 'Spending habits' end,
          'summary', coalesce(reason, 'Passive signal available'),
          'delta', case when enabled then 'Live' else 'Off' end,
          'status', case when enabled and available then 'healthy' else 'disabled' end
        )
      )
      from public.user_provider_settings
      where user_id = auth.uid()
    ), '[]'::jsonb),
    'recentActivity', coalesce((
      select coalesce(
        jsonb_agg(activity_entry order by created_at desc),
        '[]'::jsonb
      )
      from (
        select
          jsonb_build_object(
            'id', a.id,
            'sporeId', a.spore_id,
            'type', 'challenge-created',
            'memberId', a.created_by,
            'memberName', p.display_name,
            'content', a.title,
            'timestampLabel', to_char(a.created_at, 'Mon DD'),
            'createdAt', a.created_at
          ) as activity_entry,
          a.created_at
        from public.activities a
        join public.profiles p on p.id = a.created_by
        where a.spore_id = target_spore_id
        order by a.created_at desc
        limit 5
      ) recent_activity
    ), '[]'::jsonb),
    'activeChallenges', coalesce((
      select coalesce(
        jsonb_agg(challenge_entry order by created_at desc),
        '[]'::jsonb
      )
      from (
        select
          jsonb_build_object(
            'id', a.id,
            'sporeId', a.spore_id,
            'title', a.title,
            'description', a.description,
            'icon', a.icon,
            'category', a.category,
            'durationLabel', a.duration_label,
            'participantIds', a.participant_ids,
            'completedByIds', a.completed_by_ids,
            'createdBy', a.created_by,
            'createdAt', a.created_at,
            'endsAt', a.ends_at
          ) as challenge_entry,
          a.created_at
        from public.activities a
        where a.spore_id = target_spore_id
          and a.kind = 'challenge'
        order by a.created_at desc
        limit 3
      ) active_challenges
    ), '[]'::jsonb),
    'latestCheckIn', (
      select jsonb_build_object(
        'id', c.id,
        'memberId', c.member_id,
        'mood', c.mood,
        'energy', c.energy,
        'stress', c.stress,
        'sleep', c.sleep,
        'socialBattery', c.social_battery,
        'note', c.note,
        'timestampLabel', to_char(c.created_at, 'Mon DD'),
        'createdAt', c.created_at
      )
      from public.check_ins c
      where c.member_id = auth.uid()
      order by c.created_at desc
      limit 1
    )
  );
$$;
