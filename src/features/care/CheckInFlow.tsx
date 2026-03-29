import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
import type { DimensionValue } from "react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useCreateCheckIn } from "@/src/features/care/api"
import { useAppStore } from "@/src/store/app-store"
import { InputField, PrimaryButton, SecondaryButton } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

const steps = [
  { key: "mood", title: "How are you feeling?", min: "Heavy", max: "Light" },
  { key: "energy", title: "Energy level", min: "Depleted", max: "Energized" },
  { key: "stress", title: "Tension", min: "Calm", max: "Stressed" },
  { key: "sleep", title: "Rest", min: "Poor", max: "Restful" },
  { key: "socialBattery", title: "Social energy", min: "Drained", max: "Full" },
] as const

export function CheckInFlow() {
  const router = useRouter()
  const activeSporeId = useAppStore((state) => state.activeSporeId) ?? "spore-1"
  const createCheckIn = useCreateCheckIn(activeSporeId)
  const [step, setStep] = useState(0)
  const [values, setValues] = useState({
    mood: 5,
    energy: 5,
    stress: 5,
    sleep: 5,
    socialBattery: 5,
    note: "",
  })

  const current = steps[step]
  const progress = useMemo(() => `${((step + 1) / (steps.length + 1)) * 100}%`, [step])

  const save = async () => {
    await createCheckIn.mutateAsync(values)
    router.back()
  }

  if (step === steps.length) {
    return (
      <View style={styles.content}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: "100%" }]} />
        </View>
        <Text style={styles.title}>Anything else?</Text>
        <Text style={styles.subtitle}>Optional. Capture a thought or feeling that would help your future self.</Text>
        <InputField
          multiline
          value={values.note}
          onChangeText={(note) => setValues((currentValues) => ({ ...currentValues, note }))}
          placeholder="Write freely..."
        />
        <View style={styles.actions}>
          <SecondaryButton label="Skip" onPress={save} />
          <PrimaryButton label={createCheckIn.isPending ? "Saving..." : "Complete"} onPress={save} disabled={createCheckIn.isPending} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.content}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progress as DimensionValue }]} />
      </View>
      <Text style={styles.title}>{current.title}</Text>
      <View style={styles.scaleLabels}>
        <Text style={styles.scaleLabel}>{current.min}</Text>
        <Text style={styles.scaleLabel}>{current.max}</Text>
      </View>
      <View style={styles.scaleRow}>
        {Array.from({ length: 11 }).map((_, index) => {
          const selected = values[current.key] === index
          const passed = values[current.key] > index
          return (
            <Pressable
              key={index}
              onPress={() => setValues((currentValues) => ({ ...currentValues, [current.key]: index }))}
              style={styles.scaleTouch}
            >
              <View style={[styles.scaleDot, selected && styles.scaleDotSelected, passed && !selected && styles.scaleDotPassed]} />
            </Pressable>
          )
        })}
      </View>
      <Text style={styles.scaleValue}>{values[current.key]}</Text>
      <View style={styles.actions}>
        {step > 0 ? <SecondaryButton label="Back" onPress={() => setStep((value) => value - 1)} /> : null}
        <PrimaryButton label="Continue" onPress={() => setStep((value) => value + 1)} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.muted,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.foreground,
    fontSize: 24,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleLabel: {
    color: colors.mutedForeground,
    fontSize: 12,
  },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scaleTouch: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  scaleDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(138,132,125,0.35)",
  },
  scaleDotSelected: {
    width: 18,
    height: 18,
    backgroundColor: colors.primary,
  },
  scaleDotPassed: {
    backgroundColor: colors.primary,
  },
  scaleValue: {
    alignSelf: "center",
    color: colors.foreground,
    fontSize: 42,
    fontWeight: "600",
  },
  actions: {
    gap: spacing.md,
  },
})
