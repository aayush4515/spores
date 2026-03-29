drop function if exists public.create_spore_onboarding(json);
drop function if exists public.accept_invite_onboarding(json);

-- The canonical jsonb signatures are created in 0004_phase2_onboarding.sql.
-- This migration only removes any older json overloads that could cause RPC ambiguity.
