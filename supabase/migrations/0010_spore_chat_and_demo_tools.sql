create table if not exists public.spore_messages (
  id uuid primary key default gen_random_uuid(),
  spore_id uuid not null references public.spores(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null default '',
  author_avatar text not null default '🌱',
  message_type text not null default 'user' check (message_type in ('user', 'system')),
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists spore_messages_spore_created_idx
on public.spore_messages (spore_id, created_at desc);

alter table public.spore_messages enable row level security;

create policy "spore_messages_member_select" on public.spore_messages
for select using (public.is_spore_member(spore_id));

create policy "spore_messages_member_insert" on public.spore_messages
for insert with check (
  public.is_spore_member(spore_id)
  and message_type = 'user'
  and author_id = auth.uid()
);

create or replace function public.create_spore_invite(target_spore_id uuid, invite_email text default null)
returns jsonb
language plpgsql
security definer
as $$
declare
  invite_row public.spore_invites;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_spore_member(target_spore_id) then
    raise exception 'You are not a member of this Spore';
  end if;

  insert into public.spore_invites (spore_id, invite_code, email, invited_by)
  values (
    target_spore_id,
    upper(encode(gen_random_bytes(4), 'hex')),
    nullif(trim(invite_email), ''),
    auth.uid()
  )
  returning * into invite_row;

  return jsonb_build_object(
    'id', invite_row.id,
    'sporeId', invite_row.spore_id,
    'inviteCode', invite_row.invite_code,
    'email', invite_row.email,
    'invitedBy', invite_row.invited_by,
    'acceptedAt', invite_row.accepted_at,
    'createdAt', invite_row.created_at,
    'status', case when invite_row.accepted_at is null then 'pending' else 'accepted' end
  );
end;
$$;

create or replace function public.send_spore_message(target_spore_id uuid, message_body text)
returns jsonb
language plpgsql
security definer
as $$
declare
  sender_record public.profiles;
  inserted public.spore_messages;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_spore_member(target_spore_id) then
    raise exception 'You are not a member of this Spore';
  end if;

  if coalesce(trim(message_body), '') = '' then
    raise exception 'Message body is required';
  end if;

  select *
  into sender_record
  from public.profiles
  where id = auth.uid()
  limit 1;

  insert into public.spore_messages (
    spore_id,
    author_id,
    author_name,
    author_avatar,
    message_type,
    body
  )
  values (
    target_spore_id,
    auth.uid(),
    coalesce(sender_record.display_name, 'Member'),
    coalesce(sender_record.avatar, '🌱'),
    'user',
    trim(message_body)
  )
  returning * into inserted;

  return jsonb_build_object(
    'id', inserted.id,
    'sporeId', inserted.spore_id,
    'authorId', inserted.author_id,
    'authorName', inserted.author_name,
    'authorAvatar', inserted.author_avatar,
    'messageType', inserted.message_type,
    'body', inserted.body,
    'metadata', inserted.metadata,
    'createdAt', inserted.created_at
  );
end;
$$;

create or replace function public.log_challenge_message()
returns trigger
language plpgsql
security definer
as $$
declare
  creator public.profiles;
begin
  if new.kind <> 'challenge' then
    return new;
  end if;

  select *
  into creator
  from public.profiles
  where id = new.created_by
  limit 1;

  insert into public.spore_messages (
    spore_id,
    author_id,
    author_name,
    author_avatar,
    message_type,
    body,
    metadata
  )
  values (
    new.spore_id,
    new.created_by,
    coalesce(creator.display_name, 'Someone'),
    coalesce(creator.avatar, '🌱'),
    'system',
    coalesce(creator.display_name, 'Someone') || ' started ' || new.title || '. Join in if it feels supportive.',
    jsonb_build_object('source', 'challenge-created', 'challengeId', new.id)
  );

  return new;
end;
$$;

drop trigger if exists activities_log_challenge_message on public.activities;
create trigger activities_log_challenge_message
after insert on public.activities
for each row execute function public.log_challenge_message();
