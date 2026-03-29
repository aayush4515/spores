import fs from "node:fs"
import path from "node:path"

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/)
  const result = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIndex = trimmed.indexOf("=")
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^"(.*)"$/, "$1")
    result[key] = value
  }

  return result
}

function loadEnv() {
  const cwd = process.cwd()
  return {
    ...readEnvFile(path.join(cwd, ".env")),
    ...process.env,
  }
}

function parseArgs(argv) {
  const parsed = {}
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (!arg.startsWith("--")) continue
    const key = arg.slice(2)
    const next = argv[i + 1]
    parsed[key] = next && !next.startsWith("--") ? next : "true"
    if (parsed[key] !== "true") i += 1
  }
  return parsed
}

function usage() {
  console.log(`Usage:
  npm run demo:notify -- \\
    --spore <spore-id> \\
    --target-member <member-id> \\
    --audience self|friends|both \\
    --self-title "Hey, let's go out for a walk" \\
    --self-body "Hey, let's go out for a walk" \\
    --friends-title "Check in on Aayush" \\
    --friends-body "Hey, [name] hasn't stepped out of his house for four days. Maybe it's time to check in on him"

Aliases:
  --title maps to --self-title
  --body maps to --self-body
`)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help || args.h || !args.spore || !args["target-member"]) {
    usage()
    process.exit(args.help || args.h ? 0 : 1)
  }

  const env = loadEnv()
  const supabaseUrl = env.SUPABASE_URL || env.EXPO_PUBLIC_SUPABASE_URL
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || supabaseUrl.includes("your-project.supabase.co")) {
    throw new Error("Missing a real SUPABASE_URL or EXPO_PUBLIC_SUPABASE_URL in .env")
  }

  if (!serviceRoleKey || serviceRoleKey === "your-supabase-service-role-key") {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env")
  }

  const body = {
    sporeId: args.spore,
    targetMemberId: args["target-member"],
    audience: args.audience || "both",
    selfTitle: args["self-title"] || args.title || "A gentle nudge",
    selfBody: args["self-body"] || args.body || "Thinking of you today.",
    friendsTitle: args["friends-title"] || "Check in on your friend",
    friendsBody: args["friends-body"] || "",
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/functions/v1/send-demo-notification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify(body),
  })

  const json = await response.json()
  if (!response.ok || json.ok === false) {
    throw new Error(json.error || `Request failed with status ${response.status}`)
  }

  console.log(JSON.stringify({
    ok: true,
    notificationsCreated: json.notifications?.length ?? 0,
    concernBand: json.context?.currentConcernBand,
    memberName: json.context?.memberName,
    pushResults: json.pushResults ?? [],
  }, null, 2))
}

main().catch((error) => {
  console.error(String(error))
  process.exit(1)
})
