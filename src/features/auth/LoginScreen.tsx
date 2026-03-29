import { useRouter } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { useSignIn } from "@/src/features/auth/api"
import { InputField, PageHeader, PrimaryButton, ScreenView, SecondaryButton } from "@/src/components/ui/primitives"
import { colors, spacing } from "@/src/theme/tokens"

export function LoginScreen() {
  const router = useRouter()
  const signIn = useSignIn()
  const [email, setEmail] = useState("hello@spores.app")
  const [password, setPassword] = useState("password123")
  const [localError, setLocalError] = useState("")

  const handleSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedEmail || !password) {
      setLocalError("Enter your email and password to continue.")
      return
    }

    setLocalError("")
    signIn.mutate(
      { email: trimmedEmail, password },
      {
        onSuccess: (result) => {
          router.replace(result.profile?.onboardingCompleted ? "/(tabs)/home" : "/(onboarding)")
        },
        onError: (error) => {
          setLocalError(error instanceof Error ? error.message : "We could not log you in right now.")
        },
      }
    )
  }

  return (
    <ScreenView contentContainerStyle={styles.content}>
      <PageHeader title="Welcome back" subtitle="Log in to continue into your Spores circles." />
      <View style={styles.form}>
        <InputField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
        {!localError && signIn.error ? <Text style={styles.errorText}>{signIn.error.message}</Text> : null}
      </View>
      <View style={styles.actions}>
        <PrimaryButton label={signIn.isPending ? "Logging in..." : "Log in"} onPress={handleSubmit} disabled={signIn.isPending} />
        <SecondaryButton label="Create account" onPress={() => router.replace("/(auth)/signup")} />
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
  errorText: {
    color: colors.destructive,
  },
})
