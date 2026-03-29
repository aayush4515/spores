import { corsHeaders } from "../_shared/cors.ts"
import { buildCareAgentContext } from "../_shared/care-agent.ts"
import { createServiceClient } from "../_shared/supabase.ts"

async function sendExpoPush({
  title,
  body,
  recipients,
  metadata,
}: {
  title: string
  body: string
  recipients: Array<{ user_id: string; expo_push_token: string }>
  metadata: Record<string, unknown>
}) {
  const tickets = await Promise.all(
    recipients.map(async (recipient) => {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient.expo_push_token,
          title,
          body,
          data: metadata,
        }),
      })
      return response.json()
    }),
  )

  return tickets
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body = await request.json()
    const sporeId = String(body.sporeId ?? "")
    const targetMemberId = String(body.targetMemberId ?? "")
    const audience = String(body.audience ?? "both")
    const selfTitle = String(body.selfTitle ?? "")
    const selfBody = String(body.selfBody ?? "")
    const friendsTitle = String(body.friendsTitle ?? "Check in on your friend")
    const friendsBody = String(body.friendsBody ?? "")

    if (!sporeId || !targetMemberId || !selfTitle || !selfBody) {
      return new Response(JSON.stringify({ ok: false, error: "sporeId, targetMemberId, selfTitle, and selfBody are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const supabase = createServiceClient()
    const context = await buildCareAgentContext({ supabase, sporeId, memberId: targetMemberId })
    const { data: memberships, error: membershipsError } = await supabase
      .from("spore_memberships")
      .select("user_id")
      .eq("spore_id", sporeId)

    if (membershipsError) throw membershipsError

    const memberIds = (memberships ?? []).map((item: { user_id: string }) => item.user_id)
    if (!memberIds.includes(targetMemberId)) {
      return new Response(JSON.stringify({ ok: false, error: "targetMemberId is not a member of the provided Spore" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
    const friendIds = memberIds.filter((item: string) => item !== targetMemberId)
    const createdRows: Array<Record<string, unknown>> = []
    const pushResults: Array<Record<string, unknown>> = []

    const createRows = async ({
      recipientIds,
      title,
      bodyText,
      recipientGroup,
    }: {
      recipientIds: string[]
      title: string
      bodyText: string
      recipientGroup: "self" | "friends"
    }) => {
      if (!recipientIds.length || !bodyText) return

      const rows = recipientIds.map((recipientId) => ({
        user_id: recipientId,
        spore_id: sporeId,
        title,
        body: bodyText.replace(/\[name\]/g, context.memberName),
        kind: "server",
        metadata: {
          source: "demo-trigger",
          targetMemberId,
          recipientGroup,
          careContext: context,
        },
      }))

      const { data: inserted, error: insertError } = await supabase
        .from("notifications_log")
        .insert(rows)
        .select("id, user_id, title, body, created_at")

      if (insertError) throw insertError
      createdRows.push(...(inserted ?? []))

      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from("push_subscriptions")
        .select("user_id, expo_push_token")
        .eq("enabled", true)
        .in("user_id", recipientIds)

      if (subscriptionsError) throw subscriptionsError

      const tickets = await sendExpoPush({
        title,
        body: bodyText.replace(/\[name\]/g, context.memberName),
        recipients: subscriptions ?? [],
        metadata: {
          sporeId,
          targetMemberId,
          recipientGroup,
        },
      })

      pushResults.push({
        recipientGroup,
        sent: (subscriptions ?? []).length,
        tickets,
      })
    }

    if (audience === "self" || audience === "both") {
      await createRows({
        recipientIds: [targetMemberId],
        title: selfTitle,
        bodyText: selfBody,
        recipientGroup: "self",
      })
    }

    if ((audience === "friends" || audience === "both") && friendsBody) {
      await createRows({
        recipientIds: friendIds,
        title: friendsTitle,
        bodyText: friendsBody,
        recipientGroup: "friends",
      })
    }

    return new Response(JSON.stringify({
      ok: true,
      context,
      notifications: createdRows,
      pushResults,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
