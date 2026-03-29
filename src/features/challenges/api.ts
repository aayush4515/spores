import { useMutation, useQuery } from "@tanstack/react-query"
import { demoData } from "@/src/mocks/data/demo"
import { queryClient } from "@/src/lib/query-client"
import { shouldUseDemoData } from "@/src/lib/runtime"
import { supabase } from "@/src/lib/supabase"
import { useAppStore } from "@/src/store/app-store"
import type { ChallengeCategory, ChallengeSummary } from "@/src/types/domain"

function mapChallenge(item: any): ChallengeSummary {
  return {
    id: item.id,
    sporeId: item.spore_id ?? item.sporeId,
    title: item.title,
    description: item.description,
    icon: item.icon,
    category: item.category,
    durationLabel: item.duration_label ?? item.durationLabel,
    participantIds: item.participant_ids ?? item.participantIds ?? [],
    completedByIds: item.completed_by_ids ?? item.completedByIds ?? [],
    createdBy: item.created_by ?? item.createdBy,
    createdAt: item.created_at ?? item.createdAt,
    endsAt: item.ends_at ?? item.endsAt,
  }
}

export async function fetchChallenges(sporeId: string) {
  if (shouldUseDemoData()) {
    const detail = await demoData.getSporeDetail(sporeId)
    return detail.challenges
  }
  const { data, error } = await supabase!.from("activities").select("*").eq("spore_id", sporeId).eq("kind", "challenge")
  if (error) throw error
  return (data ?? []).map(mapChallenge)
}

export async function createChallenge(
  sporeId: string,
  input: {
    title: string
    description: string
    icon: string
    category: ChallengeCategory
    durationLabel: string
    participantIds: string[]
  }
) {
  if (shouldUseDemoData()) return demoData.createChallenge(sporeId, input)
  const profileId = useAppStore.getState().auth.profile?.id
  const { data, error } = await supabase!.from("activities").insert({
    spore_id: sporeId,
    kind: "challenge",
    title: input.title,
    description: input.description,
    icon: input.icon,
    category: input.category,
    duration_label: input.durationLabel,
    participant_ids: Array.from(new Set([profileId, ...input.participantIds].filter(Boolean))),
    created_by: profileId,
  }).select().single()
  if (error) throw error
  return mapChallenge(data)
}

export async function joinChallenge(challengeId: string) {
  if (shouldUseDemoData()) return demoData.joinChallenge(challengeId)
  const { error } = await supabase!.rpc("join_activity", { target_activity_id: challengeId })
  if (error) throw error
  return true
}

export async function completeChallenge(sporeId: string, challengeId: string) {
  if (shouldUseDemoData()) return demoData.completeChallenge(sporeId, challengeId)
  const { error } = await supabase!.rpc("complete_activity", { target_activity_id: challengeId })
  if (error) throw error
  return true
}

function invalidateChallenges(sporeId: string) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["challenges", sporeId] }),
    queryClient.invalidateQueries({ queryKey: ["spore-detail", sporeId] }),
    queryClient.invalidateQueries({ queryKey: ["home-summary", sporeId] }),
    queryClient.invalidateQueries({ queryKey: ["spore-messages", sporeId] }),
    queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  ])
}

export function useChallenges(sporeId: string) {
  return useQuery({
    queryKey: ["challenges", sporeId],
    queryFn: () => fetchChallenges(sporeId),
    enabled: Boolean(sporeId),
  })
}

export function useCreateChallenge(sporeId: string) {
  return useMutation({
    mutationFn: (input: Parameters<typeof createChallenge>[1]) => createChallenge(sporeId, input),
    onSuccess: async () => {
      await invalidateChallenges(sporeId)
    },
  })
}

export function useJoinChallenge(sporeId: string) {
  return useMutation({
    mutationFn: joinChallenge,
    onSuccess: async () => {
      await invalidateChallenges(sporeId)
    },
  })
}

export function useCompleteChallenge(sporeId: string) {
  return useMutation({
    mutationFn: (challengeId: string) => completeChallenge(sporeId, challengeId),
    onSuccess: async () => {
      await invalidateChallenges(sporeId)
    },
  })
}
