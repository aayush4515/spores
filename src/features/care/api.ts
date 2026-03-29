import { useMutation } from "@tanstack/react-query"
import { demoData } from "@/src/mocks/data/demo"
import { queryClient } from "@/src/lib/query-client"
import { shouldUseDemoData } from "@/src/lib/runtime"
import { supabase } from "@/src/lib/supabase"
import { useAppStore } from "@/src/store/app-store"
import type { AppreciationInput, CheckInInput, ObservationInput } from "@/src/types/domain"

export async function createCheckIn(sporeId: string, input: CheckInInput) {
  if (shouldUseDemoData()) return demoData.createCheckIn(sporeId, input)
  const profileId = useAppStore.getState().auth.profile?.id
  const { data, error } = await supabase!.from("check_ins").insert({
    spore_id: sporeId,
    member_id: profileId,
    mood: input.mood,
    energy: input.energy,
    stress: input.stress,
    sleep: input.sleep,
    social_battery: input.socialBattery,
    note: input.note ?? null,
  }).select().single()
  if (error) throw error
  return data
}

export async function submitObservation(sporeId: string, input: ObservationInput) {
  if (shouldUseDemoData()) return demoData.submitObservation(sporeId, input)
  const profileId = useAppStore.getState().auth.profile?.id
  const { error } = await supabase!.from("member_observations").insert({
    spore_id: sporeId,
    author_id: profileId,
    target_member_id: input.memberId,
    label: input.label,
    severity: input.severity,
    confidence: input.confidence,
    note: input.note ?? null,
  })
  if (error) throw error
  return true
}

export async function sendAppreciation(sporeId: string, input: AppreciationInput) {
  if (shouldUseDemoData()) return demoData.sendAppreciation(sporeId, input)
  const profileId = useAppStore.getState().auth.profile?.id
  const { error } = await supabase!.from("appreciations").insert({
    spore_id: sporeId,
    author_id: profileId,
    target_member_id: input.memberId,
    message: input.message,
    icon: input.icon ?? "💚",
  })
  if (error) throw error
  return true
}

function invalidateCare(sporeId: string) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["home-summary", sporeId] }),
    queryClient.invalidateQueries({ queryKey: ["spore-detail", sporeId] }),
    queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  ])
}

export function useCreateCheckIn(sporeId: string) {
  return useMutation({
    mutationFn: (input: CheckInInput) => createCheckIn(sporeId, input),
    onSuccess: async () => {
      await invalidateCare(sporeId)
    },
  })
}

export function useSubmitObservation(sporeId: string) {
  return useMutation({
    mutationFn: (input: ObservationInput) => submitObservation(sporeId, input),
    onSuccess: async () => {
      await invalidateCare(sporeId)
    },
  })
}

export function useSendAppreciation(sporeId: string) {
  return useMutation({
    mutationFn: (input: AppreciationInput) => sendAppreciation(sporeId, input),
    onSuccess: async () => {
      await invalidateCare(sporeId)
    },
  })
}
