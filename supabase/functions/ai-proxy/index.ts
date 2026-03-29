import { corsHeaders } from "../_shared/cors.ts"
import { searchMemories, storeMemory } from "../_shared/rag.ts"
import { createServiceClient } from "../_shared/supabase.ts"

function deriveConcernBand(content: string) {
  if (/hopeless|panic|can't do this|harm/i.test(content)) return "elevated"
  if (/overwhelmed|stuck|exhausted|alone/i.test(content)) return "watch"
  return "steady"
}

function buildFallbackReply(content: string, concernBand: string) {
  const normalized = content.toLowerCase()

  if (concernBand === "elevated") {
    return "I’m hearing a much heavier moment in that. Please slow this down with one breath, and if you might be unsafe, open Safety or reach out to someone in your Spore right now."
  }

  if (concernBand === "watch") {
    if (normalized.includes("overwhelmed")) {
      return "That sounds overwhelming. Let’s make it smaller together: what is the next ten-minute step that would help you feel a little less pinned down?"
    }
    return "It makes sense that this feels heavy. Do you need rest, reassurance, or one practical kind of support from someone in your Spore?"
  }

  if (normalized.includes("gratitude")) {
    return "That feels worth staying with. What about that moment made you feel supported, steady, or more like yourself?"
  }

  if (normalized.includes("breathe") || normalized.includes("breathing")) {
    return "Let’s keep it simple. Inhale for four, exhale for six, and do that three times. Then notice whether your shoulders or chest feel even slightly softer."
  }

  if (normalized.includes("process")) {
    return "We can sort it gently. What happened, what did it bring up in you, and what feels most needed now?"
  }

  return "I’m here with you. Say a little more about what feels most present right now, and we can slow it down together."
}

async function fetchOpenAIReply(content: string, memories: Array<{ content: string }>) {
  const apiKey = Deno.env.get("OPENAI_API_KEY")
  if (!apiKey) return null

  const memoryContext =
    memories.length > 0
      ? memories.map((memory) => `- ${memory.content}`).join("\n")
      : "- No relevant stored memory was found for this message."

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are the Spores listener, a gentle mental wellness support companion inside a consent-based trusted-circle app. Be warm, reflective, grounded, and non-clinical. Do not diagnose. Help the user feel heard, name one or two emotions or needs, and suggest one gentle next step when appropriate. When the moment feels heavier, encourage reaching out to trusted friends in their Spore or opening Safety for urgent support. Keep replies concise, human, and emotionally steady.",
        },
        {
          role: "system",
          content:
            "The app context includes private support circles called Spores, self check-ins, passive wellness signals, appreciation, observations, and challenges. Use this context naturally when helpful, especially if a trusted friend or gentle activity could support the user.",
        },
        {
          role: "system",
          content: `Relevant memory context:\n${memoryContext}`,
        },
        {
          role: "user",
          content,
        },
      ],
    }),
  })

  if (!response.ok) return null
  const json = await response.json()
  return json.choices?.[0]?.message?.content ?? null
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body = await request.json()
    const concernBand = deriveConcernBand(body.content ?? "")
    const memories = await searchMemories({
      query: body.content ?? "",
      sporeId: body.sporeId,
      limit: 4,
    })
    const openAIReply = await fetchOpenAIReply(body.content ?? "", memories)
    const reply = openAIReply ?? buildFallbackReply(body.content ?? "", concernBand)

    const supabase = createServiceClient()
    await supabase.from("ai_conversations").insert([
      {
        user_id: body.userId ?? null,
        spore_id: body.sporeId ?? null,
        role: "user",
        content: body.content,
        concern_band: concernBand,
      },
      {
        user_id: body.userId ?? null,
        spore_id: body.sporeId ?? null,
        role: "assistant",
        content: reply,
        concern_band: concernBand,
        citations: memories.map((memory) => String(memory.id)),
      },
    ])

    if (body.content) {
      await storeMemory({
        userId: body.userId,
        sporeId: body.sporeId,
        content: `AI session: ${body.content}`,
        sourceType: "ai",
        metadata: { concernBand },
      })
    }

    return new Response(JSON.stringify({
      ok: true,
      message: {
        role: "assistant",
        content: reply,
      },
      concernBand,
      citations: memories.map((memory) => `memory:${memory.id}`),
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
