import { corsHeaders } from "../_shared/cors.ts"
import { createServiceClient } from "../_shared/supabase.ts"

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body = await request.json()
    const supabase = createServiceClient()
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("expo_push_token")
      .eq("enabled", true)
      .eq("user_id", body.userId)

    if (error) throw error

    const tickets = await Promise.all(
      (subscriptions ?? []).map(async (subscription) => {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: subscription.expo_push_token,
            title: body.title,
            body: body.body,
            data: body.data ?? {},
          }),
        })
        return response.json()
      })
    )

    await supabase.from("notifications_log").insert({
      user_id: body.userId ?? null,
      spore_id: body.sporeId ?? null,
      title: body.title,
      body: body.body,
      kind: "push",
      metadata: { tickets },
    })

    return new Response(JSON.stringify({ ok: true, tickets }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
