import { useRouter } from "expo-router"
import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useSubmitObservation } from "@/src/features/care/api"
import { useSporeDetail } from "@/src/features/spore/api"
import { useAppStore } from "@/src/store/app-store"
import { InputField, Pill, PrimaryButton } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

const observations = [
  { label: "Seems quieter than usual", severity: "mild" as const },
  { label: "Appears stressed", severity: "moderate" as const },
  { label: "Seems withdrawn", severity: "moderate" as const },
  { label: "Avoiding plans", severity: "mild" as const },
  { label: "Low energy", severity: "mild" as const },
  { label: "Seems okay", severity: "positive" as const },
]

export function ObservationFlow({ memberId }: { memberId?: string }) {
  const router = useRouter()
  const activeSporeId = useAppStore((state) => state.activeSporeId) ?? "spore-1"
  const { data } = useSporeDetail(activeSporeId)
  const submit = useSubmitObservation(activeSporeId)
  const [targetMemberId, setTargetMemberId] = useState(memberId ?? "")
  const [selected, setSelected] = useState<(typeof observations)[number] | null>(null)
  const [confidence, setConfidence] = useState<"unsure" | "somewhat" | "confident">("somewhat")
  const [note, setNote] = useState("")

  const handleSubmit = async () => {
    if (!selected) return
    await submit.mutateAsync({
      memberId: targetMemberId,
      label: selected.label,
      severity: selected.severity,
      confidence,
      note,
    })
    router.back()
  }

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Share observation</Text>
      {!memberId ? (
        <View style={styles.memberList}>
          {data?.members.filter((member) => member.id !== "user-1").map((member) => (
            <Pressable key={member.id} onPress={() => setTargetMemberId(member.id)} style={[styles.memberRow, targetMemberId === member.id && styles.memberRowSelected]}>
              <Text style={styles.memberEmoji}>{member.avatar}</Text>
              <Text style={styles.memberName}>{member.displayName}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={styles.optionList}>
        {observations.map((item) => (
          <Pressable key={item.label} onPress={() => setSelected(item)} style={[styles.optionRow, selected?.label === item.label && styles.optionRowSelected]}>
            <View style={[styles.optionDot, item.severity === "positive" ? styles.optionPositive : item.severity === "moderate" ? styles.optionModerate : styles.optionMild]} />
            <Text style={styles.optionLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.pillWrap}>
        {(["unsure", "somewhat", "confident"] as const).map((item) => (
          <Pill key={item} label={item} selected={confidence === item} onPress={() => setConfidence(item)} />
        ))}
      </View>
      <InputField label="Note" multiline value={note} onChangeText={setNote} placeholder="Any context that would help the circle respond with care..." />
      <PrimaryButton label={submit.isPending ? "Sharing..." : "Share"} onPress={handleSubmit} disabled={!targetMemberId || !selected || submit.isPending} />
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
  memberList: { gap: spacing.sm },
  memberRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
  },
  memberRowSelected: { backgroundColor: colors.secondary },
  memberEmoji: { fontSize: 24 },
  memberName: { color: colors.foreground, fontWeight: "600" },
  optionList: { gap: spacing.sm },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
  },
  optionRowSelected: { backgroundColor: colors.secondary },
  optionDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  optionPositive: { backgroundColor: colors.primary },
  optionModerate: { backgroundColor: colors.warmth },
  optionMild: { backgroundColor: colors.mutedForeground },
  optionLabel: { color: colors.foreground },
  pillWrap: {
    flexDirection: "row",
    gap: spacing.sm,
  },
})
