import { useMutation, useQuery } from "@tanstack/react-query"
import { demoData } from "@/src/mocks/data/demo"
import { queryClient } from "@/src/lib/query-client"
import { waitForSupabaseReady } from "@/src/lib/supabase-ready"
import { supabase } from "@/src/lib/supabase"
import { useAppStore } from "@/src/store/app-store"
import type { UserProfile } from "@/src/types/domain"

const sessionKey = ["session"]

function isDemoModeEnabled() {
  return useAppStore.getState().featureFlags.demoMode
}

async function loadProfileFromSupabase(userId: string, email: string) {
  if (!supabase) return null
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    id: data.id,
    email,
    displayName: data.display_name,
    avatar: data.avatar ?? "🌱",
    onboardingCompleted: data.onboarding_completed ?? false,
    supportPhone: data.support_phone ?? "",
    activeSporeId: data.active_spore_id ?? undefined,
    supportPreferences: data.support_preferences ?? [],
    consent: data.consent ?? {},
    notifications: data.notification_preferences ?? {},
  } as UserProfile
}

async function ensureProfileRow(userId: string, email: string, displayName?: string) {
  if (!supabase) return null
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    email,
    display_name: displayName ?? email.split("@")[0],
  })
  if (error) throw error
  return loadProfileFromSupabase(userId, email)
}

export async function getAuthenticatedProfile() {
  if (!supabase) return null
  await waitForSupabaseReady()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  const session = data.session
  if (!session?.user) return null
  return (
    (await loadProfileFromSupabase(session.user.id, session.user.email ?? "")) ??
    (await ensureProfileRow(session.user.id, session.user.email ?? "", session.user.user_metadata?.display_name))
  )
}

export async function bootstrapSession() {
  if (isDemoModeEnabled()) {
    const profile = useAppStore.getState().auth.profile ?? (await demoData.bootstrapProfile())
    if (!profile.onboardingCompleted) {
      useAppStore.getState().resetOnboardingDraft({ displayName: profile.displayName, avatar: profile.avatar })
    }
    return { status: "authenticated" as const, profile }
  }

  if (!supabase) {
    return { status: "signedOut" as const, profile: null }
  }

  await waitForSupabaseReady()

  const { data } = await supabase.auth.getSession()
  const session = data.session
  if (!session?.user) {
    return { status: "signedOut" as const, profile: null }
  }
  const profile =
    (await loadProfileFromSupabase(session.user.id, session.user.email ?? "")) ??
    (await ensureProfileRow(session.user.id, session.user.email ?? "", session.user.user_metadata?.display_name))
  if (profile && !profile.onboardingCompleted) {
    useAppStore.getState().resetOnboardingDraft({ displayName: profile.displayName, avatar: profile.avatar })
  }
  return { status: "authenticated" as const, profile }
}

export async function signIn(values: { email: string; password: string }) {
  if (isDemoModeEnabled()) {
    const profile = await demoData.signIn(values.email)
    useAppStore.getState().resetOnboardingDraft({ displayName: profile.displayName, avatar: profile.avatar })
    const auth = { status: "authenticated" as const, profile }
    useAppStore.getState().setAuth(auth)
    return auth
  }

  if (!supabase) throw new Error("Supabase is not configured.")
  await waitForSupabaseReady()
  const { data, error } = await supabase.auth.signInWithPassword(values)
  if (error) throw error
  const profile =
    (await loadProfileFromSupabase(data.user.id, data.user.email ?? values.email)) ??
    (await ensureProfileRow(data.user.id, data.user.email ?? values.email))
  if (!profile) throw new Error("We could not create your profile row in Supabase.")
  useAppStore.getState().resetOnboardingDraft({ displayName: profile.displayName, avatar: profile.avatar })
  const auth = { status: "authenticated" as const, profile }
  useAppStore.getState().setAuth(auth)
  return auth
}

export async function signUp(values: { email: string; password: string; displayName: string }) {
  if (isDemoModeEnabled()) {
    const result = await demoData.signUp(values.email, values.displayName)
    useAppStore.getState().resetOnboardingDraft({ displayName: values.displayName, avatar: result.profile.avatar })
    useAppStore.getState().setAuth({ status: "authenticated", profile: result.profile })
    return result
  }

  if (!supabase) throw new Error("Supabase is not configured.")
  await waitForSupabaseReady()
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: { display_name: values.displayName },
    },
  })
  if (error) throw error
  if (data.user) {
    await ensureProfileRow(data.user.id, data.user.email ?? values.email, values.displayName)
  }
  useAppStore.getState().resetOnboardingDraft({ displayName: values.displayName })
  const profile = data.user ? await loadProfileFromSupabase(data.user.id, data.user.email ?? values.email) : null
  if (profile) {
    useAppStore.getState().setAuth({ status: "authenticated", profile })
  }
  return {
    profile,
    needsConfirmation: !data.session,
  }
}

export async function signOut() {
  if (isDemoModeEnabled()) {
    await demoData.signOut()
    useAppStore.getState().resetOnboardingDraft()
    useAppStore.getState().setAuth({ status: "signedOut", profile: null })
    return
  }

  await supabase?.auth.signOut()
  useAppStore.getState().resetOnboardingDraft()
  useAppStore.getState().setAuth({ status: "signedOut", profile: null })
}

export function useSession() {
  return useQuery({
    queryKey: sessionKey,
    queryFn: bootstrapSession,
  })
}

export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionKey })
    },
  })
}

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionKey })
    },
  })
}
