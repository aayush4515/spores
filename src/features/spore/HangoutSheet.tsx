import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { InputField, Pill, PrimaryButton } from "@/src/components/ui/primitives"
import { colors, spacing } from "@/src/theme/tokens"

const times = ["Today", "Tomorrow", "This weekend"]

export function HangoutSheet() {
  const router = useRouter()
  const { memberId } = useLocalSearchParams<{ memberId: string }>()
  const [time, setTime] = useState("Tomorrow")
  const [note, setNote] = useState("")

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Suggest hangout</Text>
      <Text style={styles.subtitle}>Invite member {memberId} into a softer, lower-pressure connection moment.</Text>
      <View style={styles.pills}>
        {times.map((item) => (
          <Pill key={item} label={item} selected={time === item} onPress={() => setTime(item)} />
        ))}
      </View>
      <InputField label="Note" multiline value={note} onChangeText={setNote} placeholder="Maybe a walk, coffee, or just a little time together..." />
      <PrimaryButton label="Send suggestion" onPress={() => router.back()} />
    </View>
  )
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  title: { color: colors.foreground, fontSize: 22, fontWeight: "600" },
  subtitle: { color: colors.mutedForeground, lineHeight: 20 },
  pills: { flexDirection: "row", gap: spacing.sm },
})
