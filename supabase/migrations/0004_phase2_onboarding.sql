create or replace function public.create_spore_onboarding(payload jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  new_spore_id uuid := gen_random_uuid();
  invite_email text;
begin
  update public.profiles
  set
    display_name = coalesce(payload->>'displayName', display_name),
    avatar = coalesce(payload->>'avatar', avatar),
    onboarding_completed = true,
    support_preferences = coalesce(array(select jsonb_array_elements_text(payload->'supportStyle')), support_preferences),
    updated_at = now()
  where id = auth.uid();

  insert into public.spores (id, created_by, name, description)
  values (
    new_spore_id,
    auth.uid(),
    coalesce(payload->>'sporeName', 'New Spore'),
    'A newly created support circle'
  );

  insert into public.spore_memberships (spore_id, user_id, role)
  values (new_spore_id, auth.uid(), 'owner');

  if jsonb_typeof(payload->'invitedEmails') = 'array' then
    for invite_email in select jsonb_array_elements_text(payload->'invitedEmails')
    loop
      insert into public.spore_invites (spore_id, invite_code, email, invited_by)
      values (new_spore_id, encode(gen_random_bytes(4), 'hex'), invite_email, auth.uid());
    end loop;
  end if;

  update public.profiles
  set active_spore_id = new_spore_id
  where id = auth.uid();

  return jsonb_build_object('sporeId', new_spore_id, 'status', 'created');
end;
$$;

create or replace function public.accept_invite_onboarding(payload jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  invite_row public.spore_invites;
begin
  select *
  into invite_row
  from public.spore_invites
  where invite_code = payload->>'inviteCode'
  limit 1;

  if invite_row.id is null then
    raise exception 'Invite not found';
  end if;

  update public.profiles
  set
    display_name = coalesce(payload->>'displayName', display_name),
    avatar = coalesce(payload->>'avatar', avatar),
    onboarding_completed = true,
    active_spore_id = invite_row.spore_id,
    support_preferences = coalesce(array(select jsonb_array_elements_text(payload->'supportStyle')), support_preferences),
    updated_at = now()
  where id = auth.uid();

  insert into public.spore_memberships (spore_id, user_id, role)
  values (invite_row.spore_id, auth.uid(), 'member')
  on conflict (spore_id, user_id) do nothing;

  update public.spore_invites
  set accepted_by = auth.uid(), accepted_at = now()
  where id = invite_row.id;

  return jsonb_build_object('sporeId', invite_row.spore_id, 'status', 'joined');
end;
$$;
