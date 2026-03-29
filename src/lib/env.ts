import Constants from "expo-constants"

function trimEnv(value: string | undefined): string {
  return typeof value === "string" ? value.trim() : ""
}

function isUsableUrl(value: string) {
  if (!value) return false
  if (value.includes("your-project.supabase.co")) return false
  try {
    const url = new URL(value)
    return url.protocol === "https:"
  } catch {
    return false
  }
}

function isUsableAnonKey(value: string) {
  if (!value) return false
  if (value === "your-supabase-anon-key") return false
  return value.length > 20
}

/** Project ref from `https://<ref>.supabase.co` (null if custom domain). */
export function supabaseProjectRefFromUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname
    const m = host.match(/^([^.]+)\.supabase\.co$/i)
    return m ? m[1] : null
  } catch {
    return null
  }
}

function jwtPayloadRef(anonKey: string): string | null {
  try {
    const segment = anonKey.split(".")[1]
    if (!segment) return null
    const b64 = segment.replace(/-/g, "+").replace(/_/g, "/")
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4)
    const json = atob(padded)
    const payload = JSON.parse(json) as { ref?: string }
    return typeof payload.ref === "string" ? payload.ref : null
  } catch {
    return null
  }
}

export const env = {
  supabaseUrl: trimEnv(
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? Constants.expoConfig?.extra?.supabaseUrl,
  ),
  supabaseAnonKey: trimEnv(
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? Constants.expoConfig?.extra?.supabaseAnonKey,
  ),
  openAIProxyUrl: trimEnv(
    process.env.EXPO_PUBLIC_OPENAI_API_URL ?? Constants.expoConfig?.extra?.openAIProxyUrl,
  ),
}

export const hasSupabaseConfig = isUsableUrl(env.supabaseUrl) && isUsableAnonKey(env.supabaseAnonKey)

if (__DEV__ && hasSupabaseConfig) {
  const hostRef = supabaseProjectRefFromUrl(env.supabaseUrl)
  const keyRef = jwtPayloadRef(env.supabaseAnonKey)
  if (hostRef && keyRef && hostRef !== keyRef) {
    console.warn(
      "[Supabase] EXPO_PUBLIC_SUPABASE_URL project ref (" +
        hostRef +
        ") does not match the anon key ref (" +
        keyRef +
        "). Use the URL and anon key from the same Project Settings.",
    )
  }
  if (!hostRef && keyRef) {
    console.warn(
      "[Supabase] URL is not *.supabase.co; ensure EXPO_PUBLIC_SUPABASE_URL matches the project that issued EXPO_PUBLIC_SUPABASE_ANON_KEY.",
    )
  }
}
