import { corsHeaders } from "../_shared/cors.ts"
import { storeMemory } from "../_shared/rag.ts"

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body = await request.json()
    const record = await storeMemory({
      userId: body.userId,
      sporeId: body.sporeId,
      content: body.content,
      sourceType: body.sourceType,
      metadata: body.metadata,
    })

    return new Response(JSON.stringify({ ok: true, record }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
