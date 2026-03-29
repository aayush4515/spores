import { corsHeaders } from "../_shared/cors.ts"
import { searchMemories } from "../_shared/rag.ts"

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body = await request.json()
    const results = await searchMemories({
      query: body.query ?? "",
      sporeId: body.sporeId,
      limit: body.limit ?? 5,
    })

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
