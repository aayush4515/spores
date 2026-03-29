import { corsHeaders } from "../_shared/cors.ts"
import { buildCareAgentContext } from "../_shared/care-agent.ts"
import { createServiceClient } from "../_shared/supabase.ts"

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body = await request.json()
    const sporeId = String(body.sporeId ?? "")
    const memberId = String(body.memberId ?? "")

    if (!sporeId || !memberId) {
      return new Response(JSON.stringify({ ok: false, error: "sporeId and memberId are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const supabase = createServiceClient()
    const context = await buildCareAgentContext({ supabase, sporeId, memberId })

    return new Response(JSON.stringify({ ok: true, context }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
