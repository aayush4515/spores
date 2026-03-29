import { useRouter } from "expo-router"
import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useSendAppreciation } from "@/src/features/care/api"
import { useSporeDetail } from "@/src/features/spore/api"
import { useAppStore } from "@/src/store/app-store"
import { InputField, Pill, PrimaryButton } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

const presets = [
  { text: "Thinking of you", icon: "💭" },
  { text: "You’ve got this", icon: "💪" },
  { text: "Here if you need me", icon: "🤝" },
  { text: "Grateful for you", icon: "🙏" },
  { text: "Sending warmth", icon: "☀️" },
  { text: "You matter", icon: "💚" },
]

export function AppreciationFlow({ memberId }: { memberId?: string }) {
  const router = useRouter()
  const activeSporeId = useAppStore((state) => state.activeSporeId) ?? "spore-1"
  const { data } = useSporeDetail(activeSporeId)
  const send = useSendAppreciation(activeSporeId)
  const [targetMemberId, setTargetMemberId] = useState(memberId ?? "")
  const [message, setMessage] = useState("")

  const submit = async () => {
    await send.mutateAsync({ memberId: targetMemberId, message })
    router.back()
  }

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Send support</Text>
      {!memberId ? (
        <View style={styles.memberList}>
          {data?.members.filter((member) => member.id !== "user-1").map((member) => (
            <Pressable key={member.id} onPress={() => setTargetMemberId(member.id)} style={[styles.memberRow, targetMemberId === member.id && styles.memberRowSelected]}>
              <Text style={styles.memberEmoji}>{member.avatar}</Text>
              <View>
                <Text style={styles.memberName}>{member.displayName}</Text>
                <Text style={styles.memberMeta}>{member.lastSeenLabel}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={styles.pillWrap}>
        {presets.map((preset) => (
          <Pill key={preset.text} label={`${preset.icon} ${preset.text}`} selected={message === preset.text} onPress={() => setMessage(preset.text)} />
        ))}
      </View>
      <InputField
        label="Custom note"
        multiline
        value={message}
        onChangeText={setMessage}
        placeholder="Write something meaningful..."
      />
      <PrimaryButton label={send.isPending ? "Sending..." : "Send"} onPress={submit} disabled={!targetMemberId || !message || send.isPending} />
    </View>
  )
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  title: {
    color: colors.foreground,
    fontSize: 22,
    fontWeight: "600",
  },
  memberList: {
    gap: spacing.sm,
  },
  memberRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
  },
  memberRowSelected: {
    backgroundColor: colors.secondary,
  },
  memberEmoji: {
    fontSize: 24,
  },
  memberName: {
    color: colors.foreground,
    fontWeight: "600",
  },
  memberMeta: {
    color: colors.mutedForeground,
    fontSize: 12,
    marginTop: 2,
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
})
