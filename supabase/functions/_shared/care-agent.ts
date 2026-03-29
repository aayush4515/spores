type JsonRecord = Record<string, unknown>

function toConcernBand({
  latestMood,
  recentSignals,
  recentObservations,
}: {
  latestMood?: number
  recentSignals: Array<{ summary?: string }>
  recentObservations: Array<{ severity?: string }>
}) {
  const watchObservation = recentObservations.some((item) => item.severity === "moderate")
  const signalText = recentSignals.map((item) => String(item.summary ?? "")).join(" ").toLowerCase()

  if ((typeof latestMood === "number" && latestMood <= 3) || signalText.includes("hasn't stepped out")) {
    return "elevated"
  }

  if ((typeof latestMood === "number" && latestMood <= 5) || watchObservation || signalText.includes("lower")) {
    return "watch"
  }

  return "steady"
}

export async function buildCareAgentContext({
  supabase,
  sporeId,
  memberId,
}: {
  supabase: any
  sporeId: string
  memberId: string
}) {
  const [{ data: member }, { data: checkIns }, { data: signals }, { data: observations }, { data: memories }] =
    await Promise.all([
      supabase.from("profiles").select("id, display_name").eq("id", memberId).single(),
      supabase
        .from("check_ins")
        .select("id, mood, energy, stress, sleep, social_battery, note, created_at")
        .eq("spore_id", sporeId)
        .eq("member_id", memberId)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("passive_signal_events")
        .select("id, provider_key, metric_name, metric_value, summary, created_at")
        .eq("user_id", memberId)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("member_observations")
        .select("id, label, severity, note, created_at")
        .eq("spore_id", sporeId)
        .eq("target_member_id", memberId)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("rag_memories")
        .select("id, content, source_type, created_at")
        .or(`user_id.eq.${memberId},spore_id.eq.${sporeId}`)
        .order("created_at", { ascending: false })
        .limit(6),
    ])

  const latestMood = checkIns?.[0]?.mood
  const concernBand = toConcernBand({
    latestMood,
    recentSignals: (signals ?? []).map((item: JsonRecord) => ({ summary: String(item.summary ?? "") })),
    recentObservations: (observations ?? []).map((item: JsonRecord) => ({ severity: String(item.severity ?? "") })),
  })

  const memberName = String(member?.display_name ?? "This member")
  const summary =
    concernBand === "elevated"
      ? `${memberName} is showing a more unusual pattern lately, with softer check-ins or lower movement signals that may warrant a gentle reach-out.`
      : concernBand === "watch"
      ? `${memberName} is a little outside their usual rhythm and may benefit from a quiet check-in.`
      : `${memberName} appears close to their usual rhythm in the recent data.`

  return {
    memberId,
    sporeId,
    memberName,
    currentConcernBand: concernBand,
    latestCheckIns: (checkIns ?? []).map((item: JsonRecord) => ({
      id: item.id,
      mood: item.mood,
      energy: item.energy,
      stress: item.stress,
      sleep: item.sleep,
      socialBattery: item.social_battery,
      note: item.note,
      createdAt: item.created_at,
    })),
    recentSignals: (signals ?? []).map((item: JsonRecord) => ({
      id: item.id,
      key: item.provider_key,
      metricName: item.metric_name,
      metricValue: item.metric_value,
      capturedAt: item.created_at,
      summary: item.summary,
    })),
    recentObservations: (observations ?? []).map((item: JsonRecord) => ({
      id: item.id,
      body: item.note ?? item.label,
      severity: item.severity,
      createdAt: item.created_at,
    })),
    relevantMemories: (memories ?? []).map((item: JsonRecord) => ({
      id: item.id,
      content: item.content,
      sourceType: item.source_type,
      createdAt: item.created_at,
    })),
    summary,
  }
}
