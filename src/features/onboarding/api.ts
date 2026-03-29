import { useMutation } from "@tanstack/react-query"
import { demoData } from "@/src/mocks/data/demo"
import { getAuthenticatedProfile } from "@/src/features/auth/api"
import { queryClient } from "@/src/lib/query-client"
import { shouldUseDemoData } from "@/src/lib/runtime"
import { supabase } from "@/src/lib/supabase"
import { useAppStore } from "@/src/store/app-store"
import type { OnboardingDraft } from "@/src/types/domain"

export async function submitOnboarding(draft: OnboardingDraft) {
  if (shouldUseDemoData()) {
    const profile = await demoData.submitOnboarding(draft)
    useAppStore.getState().setAuth({ status: "authenticated", profile })
    useAppStore.getState().setActiveSporeId(profile.activeSporeId)
    useAppStore.getState().resetOnboardingDraft()
    return profile
  }

  if (!supabase) throw new Error("Supabase is not configured.")
  const rpcName = draft.mode === "join" ? "accept_invite_onboarding" : "create_spore_onboarding"
  const { data, error } = await supabase.rpc(rpcName, {
    payload: draft,
  })
  if (error) throw error
  const profile = useAppStore.getState().auth.profile ?? (await getAuthenticatedProfile())
  if (!profile) throw new Error("Missing authenticated profile during onboarding.")
  const nextProfile = {
    ...profile,
    onboardingCompleted: true,
    avatar: draft.avatar || profile.avatar || "🌱",
    displayName: draft.displayName || profile.displayName || "",
    activeSporeId:
      (typeof data?.sporeId === "string" ? data.sporeId : undefined) ??
      profile.activeSporeId,
  }
  useAppStore.getState().setActiveSporeId(nextProfile.activeSporeId)
  useAppStore.getState().setAuth({ status: "authenticated", profile: nextProfile })
  useAppStore.getState().resetOnboardingDraft()
  return data
}

export function useSubmitOnboarding() {
  return useMutation({
    mutationFn: submitOnboarding,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["session"] }),
        queryClient.invalidateQueries({ queryKey: ["spores"] }),
      ])
    },
  })
}
