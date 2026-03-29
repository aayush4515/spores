import { PropsWithChildren, ReactNode } from "react"
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, radii, shadows, spacing, typography } from "@/src/theme/tokens"

export function ScreenView({
  children,
  scroll = true,
  contentContainerStyle,
  style,
}: PropsWithChildren<{
  scroll?: boolean
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}>) {
  if (!scroll) {
    return <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>
  }

  return (
    <SafeAreaView style={[styles.screen, style]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  right?: ReactNode
}) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  )
}

export function Card({
  children,
  accent = false,
  style,
}: PropsWithChildren<{ accent?: boolean; style?: StyleProp<ViewStyle> }>) {
  return (
    <View style={[styles.card, accent && styles.cardAccent, style]}>
      {children}
    </View>
  )
}

export function SectionTitle({
  title,
  actionLabel,
  onAction,
}: {
  title: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  style,
}: {
  label: string
  onPress: () => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled ? styles.buttonDisabled : styles.buttonPrimary, style]}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
        {label}
      </Text>
    </Pressable>
  )
}

export function SecondaryButton({
  label,
  onPress,
  style,
}: {
  label: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
}) {
  return (
    <Pressable onPress={onPress} style={[styles.button, styles.buttonSecondary, style]}>
      <Text style={[styles.buttonText, { color: colors.foreground }]}>{label}</Text>
    </Pressable>
  )
}

export function InputField({
  label,
  multiline,
  style,
  inputStyle,
  ...props
}: TextInputProps & {
  label?: string
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
}) {
  return (
    <View style={style}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        multiline={multiline}
        placeholderTextColor={colors.mutedForeground}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          inputStyle,
        ]}
        {...props}
      />
    </View>
  )
}

export function Pill({
  label,
  selected = false,
  onPress,
}: {
  label: string
  selected?: boolean
  onPress?: () => void
}) {
  const content = (
    <View style={[styles.pill, selected && styles.pillSelected]}>
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
    </View>
  )

  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content
}

export function Orb({ score, size = 64 }: { score: number; size?: number }) {
  const opacity = Math.max(0.45, score / 100)
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `rgba(93,124,100,${opacity})`,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.primary,
          shadowOpacity: 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 5,
        }}
      >
        <View
          style={{
            width: size * 0.42,
            height: size * 0.42,
            borderRadius: (size * 0.42) / 2,
            backgroundColor: "rgba(255,255,255,0.3)",
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          top: size * 0.18,
          left: size * 0.18,
          width: size * 0.12,
          height: size * 0.12,
          borderRadius: (size * 0.12) / 2,
          backgroundColor: "rgba(255,255,255,0.4)",
        }}
      />
    </View>
  )
}

export function Divider() {
  return <View style={styles.divider} />
}

export function KeyValueRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.keyValueRow}>
      <Text style={styles.keyValueLabel}>{label}</Text>
      <Text style={styles.keyValueValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  eyebrow: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.6,
    color: colors.mutedForeground,
    marginBottom: spacing.xs,
    fontFamily: typography.sans,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    color: colors.foreground,
    fontWeight: "600",
    fontFamily: typography.sans,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardAccent: {
    backgroundColor: colors.secondary,
    borderColor: "transparent",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    color: colors.foreground,
    fontWeight: "600",
  },
  sectionAction: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  button: {
    minHeight: 54,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonDisabled: {
    backgroundColor: colors.muted,
  },
  buttonText: {
    color: colors.primaryForeground,
    fontSize: 15,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: colors.mutedForeground,
  },
  fieldLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    color: colors.mutedForeground,
    marginBottom: spacing.sm,
  },
  input: {
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.foreground,
  },
  inputMultiline: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.muted,
  },
  pillSelected: {
    backgroundColor: colors.foreground,
  },
  pillText: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontWeight: "600",
  },
  pillTextSelected: {
    color: colors.background,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  keyValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  keyValueLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  keyValueValue: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: "600",
  },
})
