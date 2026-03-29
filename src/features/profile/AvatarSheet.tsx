import { useRouter } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useAppStore } from "@/src/store/app-store"
import { useUpdateProfile } from "@/src/features/settings/api"
import { PrimaryButton } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

const avatarOptions = ["🌱", "🌿", "🍃", "🌸", "🌺", "🌻", "🌞", "🪴", "🌼", "🍀"]

export function AvatarSheet() {
  const router = useRouter()
  const currentAvatar = useAppStore((state) => state.auth.profile?.avatar ?? "🌱")
  const update = useUpdateProfile()
  const selected = useAppStore((state) => state.onboardingDraft.avatar) || currentAvatar
  const setAvatar = useAppStore((state) => state.updateOnboarding)

  return (
    <View style={styles.content}>
      <View style={styles.preview}>
        <View style={styles.previewCircle}>
          <Text style={styles.previewEmoji}>{selected}</Text>
        </View>
        <Text style={styles.title}>Choose avatar</Text>
      </View>
      <View style={styles.grid}>
        {avatarOptions.map((avatar) => (
          <Pressable key={avatar} onPress={() => setAvatar({ avatar })} style={[styles.avatarChoice, selected === avatar && styles.avatarChoiceSelected]}>
            <Text style={styles.avatarText}>{avatar}</Text>
          </Pressable>
        ))}
      </View>
      <PrimaryButton
        label={update.isPending ? "Saving..." : "Save avatar"}
        onPress={async () => {
          await update.mutateAsync({ avatar: selected })
          router.back()
        }}
        disabled={update.isPending}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  preview: { alignItems: "center", gap: spacing.sm },
  previewCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  previewEmoji: { fontSize: 42 },
  title: { color: colors.foreground, fontSize: 20, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  avatarChoice: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarChoiceSelected: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  avatarText: { fontSize: 28 },
})
