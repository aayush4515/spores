create or replace function public.register_push_subscription(
  expo_push_token text,
  device_platform text default 'ios'
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.push_subscriptions (
    user_id,
    expo_push_token,
    device_platform,
    enabled
  )
  values (
    auth.uid(),
    expo_push_token,
    device_platform,
    true
  )
  on conflict (expo_push_token)
  do update set
    user_id = auth.uid(),
    device_platform = excluded.device_platform,
    enabled = true,
    updated_at = now();

  update public.profiles
  set notification_preferences = jsonb_set(
    coalesce(notification_preferences, '{}'::jsonb),
    '{pushEnabled}',
    'true'::jsonb,
    true
  )
  where id = auth.uid();
end;
$$;
