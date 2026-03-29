import { useMutation, useQuery } from "@tanstack/react-query"
import { demoData } from "@/src/mocks/data/demo"
import { queryClient } from "@/src/lib/query-client"
import { shouldUseDemoData } from "@/src/lib/runtime"
import { supabase } from "@/src/lib/supabase"
import { useAppStore } from "@/src/store/app-store"
import type { ConsentSettings, FeatureFlags, NotificationPreference, UserProfile } from "@/src/types/domain"

export async function fetchProfile() {
  if (shouldUseDemoData()) return demoData.getProfile()
  return useAppStore.getState().auth.profile
}

export async function updateProfile(partial: Partial<UserProfile>) {
  if (shouldUseDemoData()) {
    const profile = await demoData.updateProfile(partial)
    useAppStore.getState().setAuth({ status: "authenticated", profile })
    return profile
  }

  if (!supabase) throw new Error("Supabase is not configured.")
  const currentProfile = useAppStore.getState().auth.profile
  if (!currentProfile) throw new Error("Missing authenticated profile.")
  const { error } = await supabase.from("profiles").update({
    display_name: partial.displayName,
    avatar: partial.avatar,
    support_phone: partial.supportPhone,
    support_preferences: partial.supportPreferences,
    consent: partial.consent,
    notification_preferences: partial.notifications,
  }).eq("id", currentProfile.id)
  if (error) throw error
  const next = { ...currentProfile, ...partial }
  useAppStore.getState().setAuth({ status: "authenticated", profile: next })
  return next
}

export async function updateNotifications(notifications: NotificationPreference) {
  return updateProfile({ notifications })
}

export async function updateConsent(consent: ConsentSettings) {
  return updateProfile({ consent })
}

export async function updateFeatureFlag(key: keyof FeatureFlags, value: boolean) {
  useAppStore.getState().setFeatureFlag(key, value)
  return useAppStore.getState().featureFlags
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  })
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["session"] }),
      ])
    },
  })
}

export function useUpdateNotifications() {
  return useMutation({
    mutationFn: updateNotifications,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export function useUpdateConsent() {
  return useMutation({
    mutationFn: updateConsent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export function useUpdateFeatureFlag() {
  return useMutation({
    mutationFn: ({ key, value }: { key: keyof FeatureFlags; value: boolean }) => updateFeatureFlag(key, value),
  })
}
