import { corsHeaders } from "../_shared/cors.ts"
import { createServiceClient } from "../_shared/supabase.ts"

function bandFromSignals(payload: Record<string, unknown>) {
  const text = String(payload.content ?? payload.summary ?? "")
  if (/hopeless|panic|withdrawn|harm/i.test(text)) return "elevated"
  if (/stressed|overwhelmed|quieter|low energy/i.test(text)) return "watch"
  return "steady"
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body = await request.json()
    const concernBand = bandFromSignals(body)
    const supabase = createServiceClient()

    if (concernBand !== "steady") {
      await supabase.from("notifications_log").insert({
        user_id: body.userId ?? null,
        spore_id: body.sporeId ?? null,
        title: concernBand === "elevated" ? "Elevated care signal" : "Care signal noticed",
        body:
          concernBand === "elevated"
            ? "A higher-risk concern was detected. Review the member context and safety resources."
            : "A gentle support follow-up may help today.",
        kind: "server",
        metadata: { concernBand, source: body.source ?? "risk-analysis" },
      })
    }

    return new Response(JSON.stringify({ ok: true, concernBand }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
