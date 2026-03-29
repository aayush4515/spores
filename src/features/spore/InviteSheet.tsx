import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { useAppStore } from "@/src/store/app-store"
import { useCreateSporeInvite, useSporeInvites, useSporeDetail } from "@/src/features/spore/api"
import { InputField, PrimaryButton } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

export function InviteSheet() {
  const { sporeId: sporeIdParam } = useLocalSearchParams<{ sporeId?: string }>()
  const activeSporeId = useAppStore((state) => state.activeSporeId)
  const sporeId = sporeIdParam ?? activeSporeId ?? ""
  const { data: detail } = useSporeDetail(sporeId)
  const { data: invites = [] } = useSporeInvites(sporeId)
  const createInvite = useCreateSporeInvite(sporeId)
  const [email, setEmail] = useState("")

  const submit = async () => {
    await createInvite.mutateAsync(email.trim() || undefined)
    setEmail("")
  }

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Invite a friend</Text>
        <Text style={styles.subtitle}>
          Create a shareable code for {detail?.summary?.name ?? "this Spore"} or add an email for a softer handoff.
        </Text>
      </View>

      <InputField
        label="Optional email"
        value={email}
        onChangeText={setEmail}
        placeholder="friend@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <PrimaryButton
        label={createInvite.isPending ? "Creating..." : "Create invite"}
        onPress={submit}
        disabled={!sporeId || createInvite.isPending}
      />

      <View style={styles.list}>
        {invites.length ? (
          invites.map((invite) => (
            <View key={invite.id} style={styles.inviteCard}>
              <View style={styles.codeBadge}>
                <Text style={styles.codeText}>{invite.inviteCode}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inviteLabel}>{invite.email || "Share this code with a trusted friend"}</Text>
                <Text style={styles.inviteMeta}>
                  {invite.status === "accepted" ? "Accepted" : "Pending"} · created {new Date(invite.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No active invites yet</Text>
            <Text style={styles.emptyText}>Create a code and pass it along to someone you trust.</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    color: colors.foreground,
    fontSize: 22,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  list: {
    gap: spacing.sm,
  },
  inviteCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
  },
  codeBadge: {
    minWidth: 86,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  codeText: {
    color: colors.foreground,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  inviteLabel: {
    color: colors.foreground,
    fontWeight: "600",
  },
  inviteMeta: {
    color: colors.mutedForeground,
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
  },
  emptyTitle: {
    color: colors.foreground,
    fontWeight: "600",
  },
  emptyText: {
    color: colors.mutedForeground,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
})
