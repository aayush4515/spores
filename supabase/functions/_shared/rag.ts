import { createServiceClient } from "./supabase.ts"

export async function storeMemory({
  userId,
  sporeId,
  content,
  sourceType = "signal",
  metadata = {},
}: {
  userId?: string
  sporeId?: string
  content: string
  sourceType?: string
  metadata?: Record<string, unknown>
}) {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from("rag_memories").insert({
    user_id: userId ?? null,
    spore_id: sporeId ?? null,
    content,
    source_type: sourceType,
    metadata,
  }).select().single()

  if (error) throw error
  return data
}

export async function searchMemories({
  query,
  sporeId,
  limit = 5,
}: {
  query: string
  sporeId?: string
  limit?: number
}) {
  const supabase = createServiceClient()
  let builder = supabase
    .from("rag_memories")
    .select("id, content, metadata, created_at")
    .ilike("content", `%${query.slice(0, 40)}%`)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (sporeId) {
    builder = builder.eq("spore_id", sporeId)
  }

  const { data, error } = await builder
  if (error) throw error
  return data ?? []
}
