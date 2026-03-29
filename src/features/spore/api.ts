import { useMutation, useQuery } from "@tanstack/react-query"
import { demoData } from "@/src/mocks/data/demo"
import { queryClient } from "@/src/lib/query-client"
import { getActiveSporeId, shouldUseDemoData } from "@/src/lib/runtime"
import { supabase } from "@/src/lib/supabase"
import { useAppStore } from "@/src/store/app-store"
import type {
  CareAgentContext,
  HomeSummary,
  InviteSummary,
  MemberCareSnapshot,
  SporeDetail,
  SporeMessage,
  SporeSummary,
} from "@/src/types/domain"

function buildFallbackHealth(sporeId: string, score = 68) {
  return {
    sporeId,
    score,
    baseline: Math.max(0, score - 8),
    activityBonus: 8,
    feedbackPenalty: 0,
    updatedAt: new Date().toISOString(),
    summary: "Your Spore is starting to take shape.",
  }
}

async function fetchUserSporesFromTables(): Promise<SporeSummary[]> {
  if (!supabase) return []
  const profile = useAppStore.getState().auth.profile
  if (!profile?.id) return []

  const { data: memberships, error: membershipsError } = await supabase
    .from("spore_memberships")
    .select("spore_id, joined_at")
    .eq("user_id", profile.id)
    .order("joined_at", { ascending: false })
  if (membershipsError) throw membershipsError

  const sporeIds = Array.from(new Set((memberships ?? []).map((item: any) => item.spore_id).filter(Boolean)))
  if (!sporeIds.length) return []

  const [{ data: spores, error: sporesError }, { data: allMemberships, error: allMembershipsError }, { data: healthRows, error: healthError }, { data: activities, error: activitiesError }] =
    await Promise.all([
      supabase.from("spores").select("id, name, description, created_at").in("id", sporeIds),
      supabase.from("spore_memberships").select("spore_id, user_id").in("spore_id", sporeIds),
      supabase.from("spore_health_snapshots").select("spore_id, score, created_at").in("spore_id", sporeIds).order("created_at", { ascending: false }),
      supabase.from("activities").select("id, spore_id, kind").in("spore_id", sporeIds),
    ])

  if (sporesError) throw sporesError
  if (allMembershipsError) throw allMembershipsError
  if (healthError) throw healthError
  if (activitiesError) throw activitiesError

  const membershipCountBySpore = new Map<string, number>()
  for (const item of allMemberships ?? []) {
    const key = item.spore_id
    membershipCountBySpore.set(key, (membershipCountBySpore.get(key) ?? 0) + 1)
  }

  const latestHealthBySpore = new Map<string, number>()
  for (const row of healthRows ?? []) {
    if (!latestHealthBySpore.has(row.spore_id)) {
      latestHealthBySpore.set(row.spore_id, row.score ?? 68)
    }
  }

  const challengeCountBySpore = new Map<string, number>()
  for (const item of activities ?? []) {
    if (item.kind === "challenge") {
      challengeCountBySpore.set(item.spore_id, (challengeCountBySpore.get(item.spore_id) ?? 0) + 1)
    }
  }

  return (spores ?? [])
    .map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description ?? "",
      memberCount: membershipCountBySpore.get(item.id) ?? 1,
      challengeCount: challengeCountBySpore.get(item.id) ?? 0,
      health: latestHealthBySpore.get(item.id) ?? 68,
      memberAvatars: profile.avatar ? [profile.avatar] : [],
    }))
    .sort((a, b) => {
      if (a.id === profile.activeSporeId) return -1
      if (b.id === profile.activeSporeId) return 1
      return 0
    })
}

function mapInviteSummary(item: any): InviteSummary {
  return {
    id: item.id,
    sporeId: item.spore_id ?? item.sporeId,
    inviteCode: item.invite_code ?? item.inviteCode,
    email: item.email ?? undefined,
    invitedBy: item.invited_by ?? item.invitedBy ?? undefined,
    acceptedAt: item.accepted_at ?? item.acceptedAt ?? undefined,
    createdAt: item.created_at ?? item.createdAt,
    status: (item.accepted_at ?? item.acceptedAt) ? "accepted" : "pending",
  }
}

function mapSporeMessage(item: any): SporeMessage {
  return {
    id: item.id,
    sporeId: item.spore_id ?? item.sporeId,
    messageType: item.message_type ?? item.messageType,
    body: item.body,
    createdAt: item.created_at ?? item.createdAt,
    authorId: item.author_id ?? item.authorId ?? undefined,
    authorName: item.author_name ?? item.authorName ?? undefined,
    authorAvatar: item.author_avatar ?? item.authorAvatar ?? undefined,
    metadata: item.metadata ?? {},
  }
}

export async function fetchUserSpores(): Promise<SporeSummary[]> {
  if (shouldUseDemoData()) return demoData.getUserSpores()
  if (!supabase) return []
  try {
    const { data, error } = await supabase.from("v_user_spores").select("*").order("created_at", { ascending: false })
    if (error) throw error
    if ((data ?? []).length > 0) {
      return (data ?? []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description ?? "",
        memberCount: item.member_count ?? 0,
        challengeCount: item.challenge_count ?? 0,
        health: item.health_score ?? 0,
        memberAvatars: item.member_avatars ?? [],
      }))
    }
  } catch {
    // Fall through to table-based composition when the view is empty or unavailable.
  }

  return fetchUserSporesFromTables()
}

export async function fetchHomeSummary(sporeId?: string): Promise<HomeSummary> {
  if (shouldUseDemoData()) return demoData.getHomeSummary(sporeId)
  const spores = await fetchUserSpores()
  const targetSporeId = sporeId ?? getActiveSporeId() ?? useAppStore.getState().auth.profile?.activeSporeId
  const resolvedSpore = spores.find((item) => item.id === targetSporeId) ?? spores[0] ?? null

  try {
    const { data, error } = await supabase!.rpc("fetch_home_summary", { target_spore_id: targetSporeId ?? resolvedSpore?.id ?? null })
    if (error) throw error
    return {
      greeting: data?.greeting ?? "Welcome back",
      careScore: data?.careScore ?? resolvedSpore?.health ?? 68,
      currentSpore: data?.currentSpore ?? resolvedSpore,
      passiveTrends: data?.passiveTrends ?? [],
      recentActivity: data?.recentActivity ?? [],
      activeChallenges: data?.activeChallenges ?? [],
      latestCheckIn: data?.latestCheckIn,
    }
  } catch {
    return {
      greeting: "Welcome back",
      careScore: resolvedSpore?.health ?? 68,
      currentSpore: resolvedSpore,
      passiveTrends: [],
      recentActivity: [],
      activeChallenges: [],
      latestCheckIn: undefined,
    }
  }
}

export async function fetchSporeDetail(sporeId: string): Promise<SporeDetail> {
  if (shouldUseDemoData()) return demoData.getSporeDetail(sporeId)
  const spores = await fetchUserSpores()
  const summary = spores.find((item) => item.id === sporeId) ?? null

  try {
    const { data, error } = await supabase!.rpc("fetch_spore_detail", { target_spore_id: sporeId })
    if (error) throw error
    return {
      summary: data?.summary ?? summary,
      health: data?.health ?? (summary ? buildFallbackHealth(sporeId, summary.health) : null),
      members: data?.members ?? [],
      activities: data?.activities ?? [],
      challenges: data?.challenges ?? [],
    }
  } catch {
    return {
      summary,
      health: summary ? buildFallbackHealth(sporeId, summary.health) : null,
      members: [],
      activities: [],
      challenges: [],
    }
  }
}

export async function fetchMemberCareSnapshot(sporeId: string, memberId: string): Promise<MemberCareSnapshot> {
  if (shouldUseDemoData()) return demoData.getMemberSnapshot(sporeId, memberId)
  const { data, error } = await supabase!.rpc("fetch_member_care_snapshot", {
    target_spore_id: sporeId,
    target_member_id: memberId,
  })
  if (error) throw error
  return data
}

export async function setActiveSpore(sporeId: string) {
  if (shouldUseDemoData()) {
    const profile = await demoData.setActiveSpore(sporeId)
    useAppStore.getState().setActiveSporeId(sporeId)
    useAppStore.getState().setAuth({ status: "authenticated", profile })
    return profile
  }

  if (!supabase) throw new Error("Supabase is not configured.")
  const profileId = useAppStore.getState().auth.profile?.id
  if (!profileId) throw new Error("Missing authenticated profile.")
  const { error } = await supabase.from("profiles").update({ active_spore_id: sporeId }).eq("id", profileId)
  if (error) throw error
  useAppStore.getState().setActiveSporeId(sporeId)
  return true
}

export async function fetchSporeInvites(sporeId: string): Promise<InviteSummary[]> {
  if (shouldUseDemoData()) return demoData.getSporeInvites(sporeId)
  if (!supabase) throw new Error("Supabase is not configured.")
  const { data, error } = await supabase
    .from("spore_invites")
    .select("id, spore_id, invite_code, email, invited_by, accepted_at, created_at")
    .eq("spore_id", sporeId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapInviteSummary)
}

export async function createSporeInvite(sporeId: string, email?: string): Promise<InviteSummary> {
  if (shouldUseDemoData()) return demoData.createSporeInvite(sporeId, email)
  if (!supabase) throw new Error("Supabase is not configured.")
  const { data, error } = await supabase.rpc("create_spore_invite", {
    target_spore_id: sporeId,
    invite_email: email ?? null,
  })
  if (error) throw error
  return mapInviteSummary(data)
}

export async function fetchSporeMessages(sporeId: string): Promise<SporeMessage[]> {
  if (shouldUseDemoData()) return demoData.getSporeMessages(sporeId)
  if (!supabase) throw new Error("Supabase is not configured.")
  const { data, error } = await supabase
    .from("spore_messages")
    .select("id, spore_id, author_id, author_name, author_avatar, message_type, body, metadata, created_at")
    .eq("spore_id", sporeId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapSporeMessage)
}

export async function sendSporeMessage(sporeId: string, body: string): Promise<SporeMessage> {
  if (shouldUseDemoData()) return demoData.sendSporeMessage(sporeId, body)
  if (!supabase) throw new Error("Supabase is not configured.")
  const { data, error } = await supabase.rpc("send_spore_message", {
    target_spore_id: sporeId,
    message_body: body,
  })
  if (error) throw error
  return mapSporeMessage(data)
}

export async function fetchCareAgentContext(sporeId: string, memberId: string): Promise<CareAgentContext> {
  if (shouldUseDemoData()) return demoData.getCareAgentContext(sporeId, memberId)
  if (!supabase) throw new Error("Supabase is not configured.")
  const { data, error } = await supabase.functions.invoke("care-agent-context", {
    body: { sporeId, memberId },
  })
  if (error) throw error
  return data.context
}

export function useUserSpores() {
  return useQuery({
    queryKey: ["spores"],
    queryFn: fetchUserSpores,
  })
}

export function useHomeSummary(sporeId?: string) {
  return useQuery({
    queryKey: ["home-summary", sporeId ?? getActiveSporeId()],
    queryFn: () => fetchHomeSummary(sporeId),
  })
}

export function useSporeDetail(sporeId: string) {
  return useQuery({
    queryKey: ["spore-detail", sporeId],
    queryFn: () => fetchSporeDetail(sporeId),
    enabled: Boolean(sporeId),
  })
}

export function useMemberCareSnapshot(sporeId: string, memberId?: string) {
  return useQuery({
    queryKey: ["member-care", sporeId, memberId],
    queryFn: () => fetchMemberCareSnapshot(sporeId, memberId!),
    enabled: Boolean(sporeId && memberId),
  })
}

export function useSetActiveSpore() {
  return useMutation({
    mutationFn: setActiveSpore,
    onSuccess: async (_result, sporeId) => {
      useAppStore.getState().setActiveSporeId(sporeId)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["spores"] }),
        queryClient.invalidateQueries({ queryKey: ["home-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["spore-detail"] }),
      ])
    },
  })
}

export function useSporeInvites(sporeId: string) {
  return useQuery({
    queryKey: ["spore-invites", sporeId],
    queryFn: () => fetchSporeInvites(sporeId),
    enabled: Boolean(sporeId),
  })
}

export function useCreateSporeInvite(sporeId: string) {
  return useMutation({
    mutationFn: (email?: string) => createSporeInvite(sporeId, email),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spore-invites", sporeId] })
    },
  })
}

export function useSporeMessages(sporeId: string) {
  return useQuery({
    queryKey: ["spore-messages", sporeId],
    queryFn: () => fetchSporeMessages(sporeId),
    enabled: Boolean(sporeId),
    refetchInterval: 3000,
  })
}

export function useSendSporeMessage(sporeId: string) {
  return useMutation({
    mutationFn: (body: string) => sendSporeMessage(sporeId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spore-messages", sporeId] })
    },
  })
}

export function useCareAgentContext(sporeId?: string, memberId?: string) {
  return useQuery({
    queryKey: ["care-agent-context", sporeId, memberId],
    queryFn: () => fetchCareAgentContext(sporeId!, memberId!),
    enabled: Boolean(sporeId && memberId),
  })
}
