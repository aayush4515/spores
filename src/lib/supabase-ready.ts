import { env, hasSupabaseConfig } from "@/src/lib/env"
import { supabase } from "@/src/lib/supabase"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function isLikelyTransientFailure(message: string) {
  const m = message.toLowerCase()
  return (
    m.includes("network request failed") ||
    m.includes("failed to fetch") ||
    m.includes("load failed") ||
    m.includes("timeout") ||
    m.includes("econnrefused") ||
    m.includes("could not connect")
  )
}

/** PostgREST responded; table missing or RLS still means API is up. */
function isSupabaseApiAliveError(code: string | undefined, message: string) {
  if (code === "PGRST116" || code === "42501" || code === "42P01") return true
  if (code === "PGRST204" || code === "PGRST205") return true
  const m = message.toLowerCase()
  return m.includes("schema cache") || m.includes("could not find the table") || m.includes("does not exist")
}

/**
 * Polls until Supabase PostgREST responds (project resumed / network OK).
 * Stops early when the API returns any well-formed error (DB up but RLS, missing table, etc.).
 */
export async function waitForSupabaseReady(options?: { maxAttempts?: number; initialDelayMs?: number }) {
  if (!supabase || !hasSupabaseConfig) return

  const maxAttempts = options?.maxAttempts ?? 12
  const initialDelayMs = options?.initialDelayMs ?? 1000

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { error } = await supabase.from("profiles").select("id").limit(1)

    if (!error) return

    const code = (error as { code?: string }).code
    const msg = error.message ?? ""

    if (isSupabaseApiAliveError(code, msg)) return

    if (!isLikelyTransientFailure(msg)) return

    if (attempt === maxAttempts) {
      try {
        const res = await fetch(`${env.supabaseUrl.replace(/\/$/, "")}/rest/v1/`, {
          headers: {
            apikey: env.supabaseAnonKey,
            Authorization: `Bearer ${env.supabaseAnonKey}`,
          },
        })
        if (res.ok || res.status === 404) return
      } catch {
        // fall through
      }
      console.warn("[Supabase] Backend still unreachable after retries; continuing bootstrap.")
      return
    }

    await sleep(Math.min(initialDelayMs * attempt, 6000))
  }
}
