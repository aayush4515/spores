import { useMutation, useQuery } from "@tanstack/react-query"
import { demoData } from "@/src/mocks/data/demo"
import { queryClient } from "@/src/lib/query-client"
import { shouldUseDemoData } from "@/src/lib/runtime"
import { supabase } from "@/src/lib/supabase"
import { useAppStore } from "@/src/store/app-store"
import type { AIMessage } from "@/src/types/domain"

function mapAIMessage(item: any): AIMessage {
  return {
    id: item.id,
    role: item.role,
    content: item.content,
    createdAt: item.created_at ?? item.createdAt,
    concernBand: item.concern_band ?? item.concernBand ?? undefined,
    citations: item.citations ?? [],
  }
}

export async function fetchConversation(sporeId?: string) {
  if (shouldUseDemoData()) return demoData.getAIConversation()
  if (!supabase) throw new Error("Supabase is not configured.")
  let query = supabase
    .from("ai_conversations")
    .select("id, role, content, concern_band, citations, created_at, spore_id")
    .order("created_at", { ascending: true })
  if (sporeId) {
    query = query.eq("spore_id", sporeId)
  }
  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(mapAIMessage)
}

export async function sendAIMessage(sporeId: string, content: string) {
  if (shouldUseDemoData()) return demoData.sendAIMessage(content)
  if (!supabase) throw new Error("Supabase is not configured.")
  const userId = useAppStore.getState().auth.profile?.id
  if (!sporeId) throw new Error("Choose or create a Spore before starting a Listener conversation.")
  const { data, error } = await supabase!.functions.invoke("ai-proxy", {
    body: { sporeId, userId, content },
  })
  if (error) throw error
  return data
}

export function useConversation(sporeId?: string) {
  return useQuery({
    queryKey: ["ai-conversation", sporeId],
    queryFn: () => fetchConversation(sporeId),
  })
}

export function useSendAIMessage(sporeId: string) {
  return useMutation({
    mutationFn: (content: string) => sendAIMessage(sporeId, content),
    onSuccess: async (result, content) => {
      const now = new Date().toISOString()
      queryClient.setQueryData<AIMessage[] | undefined>(["ai-conversation", sporeId], (current) => [
        ...(current ?? []),
        {
          id: `local-user-${now}`,
          role: "user",
          content,
          createdAt: now,
        },
        {
          id: `local-assistant-${now}`,
          role: "assistant",
          content: result?.message?.content ?? "",
          createdAt: now,
          concernBand: result?.concernBand,
          citations: result?.citations ?? [],
        },
      ])
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["ai-conversation"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
      ])
    },
  })
}
