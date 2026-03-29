import { PropsWithChildren } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native"
import { useRouter } from "expo-router"
import { colors, radii, shadows, spacing } from "@/src/theme/tokens"

export function BottomSheetScaffold({ children }: PropsWithChildren) {
  const router = useRouter()

  return (
    <Pressable style={styles.overlay} onPress={() => router.back()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.wrapper}
      >
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.handle} />
          {children}
        </Pressable>
      </KeyboardAvoidingView>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  wrapper: {
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    ...shadows.soft,
  },
  handle: {
    alignSelf: "center",
    width: 34,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.mutedForeground,
    opacity: 0.25,
    marginBottom: spacing.lg,
  },
})
