import { useRouter } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { useSignUp } from "@/src/features/auth/api"
import { InputField, PageHeader, PrimaryButton, ScreenView, SecondaryButton } from "@/src/components/ui/primitives"
import { colors, spacing } from "@/src/theme/tokens"

export function SignupScreen() {
  const router = useRouter()
  const signUp = useSignUp()
  const [displayName, setDisplayName] = useState("Aayush")
  const [email, setEmail] = useState("hello@spores.app")
  const [password, setPassword] = useState("password123")
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [localError, setLocalError] = useState("")

  const handleSubmit = async () => {
    const trimmedDisplayName = displayName.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedDisplayName) {
      setLocalError("Please enter a display name.")
      return
    }

    if (!trimmedEmail) {
      setLocalError("Please enter an email address.")
      return
    }

    if (password.length < 6) {
      setLocalError("Password should be at least 6 characters.")
      return
    }

    setLocalError("")
    setNeedsConfirmation(false)
    signUp.mutate(
      { email: trimmedEmail, password, displayName: trimmedDisplayName },
      {
        onSuccess: (result) => {
          if (result.needsConfirmation) {
            setNeedsConfirmation(true)
            return
          }
          router.replace("/(onboarding)")
        },
        onError: (error) => {
          const message =
            error instanceof Error && /user already registered/i.test(error.message)
              ? "That email is already registered. Try logging in instead."
              : error instanceof Error
              ? error.message
              : "We could not create your account right now."
          setLocalError(message)
        },
      }
    )
  }

  return (
    <ScreenView contentContainerStyle={styles.content}>
      <PageHeader title="Create your space" subtitle="Set up your profile and start building a consent-based support circle." />
      <View style={styles.form}>
        <InputField label="Display name" value={displayName} onChangeText={setDisplayName} />
        <InputField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {needsConfirmation ? <Text style={styles.noteText}>Check your email to confirm the account before continuing.</Text> : null}
        {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
        {!localError && signUp.error ? <Text style={styles.errorText}>{signUp.error.message}</Text> : null}
      </View>
      <View style={styles.actions}>
        <PrimaryButton label={signUp.isPending ? "Creating..." : "Create account"} onPress={handleSubmit} disabled={signUp.isPending} />
        <SecondaryButton label="Already have an account?" onPress={() => router.replace("/(auth)/login")} />
      </View>
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingTop: 48,
  },
  form: {
    gap: spacing.lg,
  },
  actions: {
    gap: spacing.md,
  },
  noteText: {
    color: colors.primary,
  },
  errorText: {
    color: colors.destructive,
  },
})
