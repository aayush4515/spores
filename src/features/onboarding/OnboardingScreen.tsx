import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { signOut } from "@/src/features/auth/api"
import { useSubmitOnboarding } from "@/src/features/onboarding/api"
import { useAppStore } from "@/src/store/app-store"
import { InputField, PageHeader, Pill, PrimaryButton, ScreenView, SecondaryButton } from "@/src/components/ui/primitives"
import { colors, spacing } from "@/src/theme/tokens"

const avatars = ["🌱", "🌿", "🍃", "🌸", "🌺", "🌻", "🌞", "🪴"]
const supportStyles = ["Gentle reminders", "Active listening", "Quiet presence", "Practical help"]
const alertOptions = ["Gentle nudges", "Challenge updates", "Support alerts", "AI follow-ups"]

export function OnboardingScreen() {
  const router = useRouter()
  const draft = useAppStore((state) => state.onboardingDraft)
  const hasAuthenticatedUser = useAppStore((state) => state.auth.status === "authenticated")
  const updateOnboarding = useAppStore((state) => state.updateOnboarding)
  const submit = useSubmitOnboarding()
  const [step, setStep] = useState(0)
  const [localError, setLocalError] = useState("")
  const [isSigningOut, setIsSigningOut] = useState(false)

  const steps = useMemo(
    () => [
      "intro",
      "choice",
      draft.mode === "join" ? "invite" : "spore",
      "consent",
      "sharing",
      "support",
      "alerts",
      "avatar",
      "finish",
    ],
    [draft.mode]
  )

  const current = steps[step]

  const next = async () => {
    if (current === "finish") {
      setLocalError("")
      submit.mutate(draft, {
        onSuccess: () => {
          router.replace("/(tabs)/home")
        },
        onError: (error) => {
          setLocalError(error instanceof Error ? error.message : "We could not finish onboarding right now.")
        },
      })
      return
    }
    setStep((value) => Math.min(steps.length - 1, value + 1))
  }

  return (
    <ScreenView contentContainerStyle={styles.content}>
      <PageHeader
        eyebrow={`Step ${step + 1} of ${steps.length}`}
        title="Build your Spore"
        subtitle="A slower, more detailed onboarding that keeps consent, sharing, and support style explicit."
      />

      {hasAuthenticatedUser ? (
        <Pressable
          onPress={async () => {
            setIsSigningOut(true)
            try {
              await signOut()
              router.replace("/(auth)/welcome")
            } finally {
              setIsSigningOut(false)
            }
          }}
          style={styles.signOutLink}
        >
          <Text style={styles.signOutText}>{isSigningOut ? "Signing out..." : "Use a different account"}</Text>
        </Pressable>
      ) : null}

      {current === "intro" ? (
        <View style={styles.stack}>
          <Text style={styles.bodyText}>Each private support space is called a Spore. It works best when everyone knows what they’re consenting to and how support should feel.</Text>
          <InputField label="Display name" value={draft.displayName} onChangeText={(value) => updateOnboarding({ displayName: value })} placeholder="How should your circle know you?" />
        </View>
      ) : null}

      {current === "choice" ? (
        <View style={styles.stack}>
          <Text style={styles.sectionLabel}>Choose your path</Text>
          <View style={styles.choiceRow}>
            <ChoiceCard title="Create a Spore" subtitle="Start a trusted support circle from scratch." selected={draft.mode === "create"} onPress={() => updateOnboarding({ mode: "create" })} />
            <ChoiceCard title="Join a Spore" subtitle="Enter with an invite code from someone you trust." selected={draft.mode === "join"} onPress={() => updateOnboarding({ mode: "join" })} />
          </View>
        </View>
      ) : null}

      {current === "spore" ? (
        <View style={styles.stack}>
          <InputField label="Spore name" value={draft.sporeName} onChangeText={(value) => updateOnboarding({ sporeName: value })} placeholder="Inner Circle" />
          <InputField label="Invite friends" value={draft.invitedEmails.join(", ")} onChangeText={(value) => updateOnboarding({ invitedEmails: value.split(",").map((item) => item.trim()).filter(Boolean) })} placeholder="email1@example.com, email2@example.com" multiline />
        </View>
      ) : null}

      {current === "invite" ? (
        <View style={styles.stack}>
          <InputField label="Invite code" value={draft.inviteCode} onChangeText={(value) => updateOnboarding({ inviteCode: value })} placeholder="SPORE-ABCD" />
          <Text style={styles.bodyText}>Joining keeps the same detailed consent flow, so everyone enters the circle with the same expectations.</Text>
        </View>
      ) : null}

      {current === "consent" ? (
        <View style={styles.stack}>
          <Text style={styles.sectionLabel}>Consent and care</Text>
          <Text style={styles.bodyText}>Support actions, observations, passive signals, and AI memory all stay opt-in. You can change these later in Settings.</Text>
          <ChoiceCard title="I understand and consent" subtitle="You can still adjust privacy and notification controls later." selected={draft.consentAccepted} onPress={() => updateOnboarding({ consentAccepted: !draft.consentAccepted })} />
        </View>
      ) : null}

      {current === "sharing" ? (
        <View style={styles.stack}>
          <Text style={styles.sectionLabel}>Sharing style</Text>
          {["Balanced sharing", "Only key signals", "Gentle updates"].map((option) => (
            <ChoiceCard key={option} title={option} subtitle="Choose how much of your wellness data should be visible in your circle." selected={draft.sharingStyle === option} onPress={() => updateOnboarding({ sharingStyle: option })} />
          ))}
        </View>
      ) : null}

      {current === "support" ? (
        <View style={styles.stack}>
          <Text style={styles.sectionLabel}>How support should feel</Text>
          <View style={styles.pillWrap}>
            {supportStyles.map((item) => {
              const selected = draft.supportStyle.includes(item)
              return (
                <Pill
                  key={item}
                  label={item}
                  selected={selected}
                  onPress={() =>
                    updateOnboarding({
                      supportStyle: selected ? draft.supportStyle.filter((value) => value !== item) : [...draft.supportStyle, item],
                    })
                  }
                />
              )
            })}
          </View>
        </View>
      ) : null}

      {current === "alerts" ? (
        <View style={styles.stack}>
          <Text style={styles.sectionLabel}>Alert preferences</Text>
          <View style={styles.pillWrap}>
            {alertOptions.map((item) => {
              const selected = draft.alertPrefs.includes(item)
              return (
                <Pill
                  key={item}
                  label={item}
                  selected={selected}
                  onPress={() =>
                    updateOnboarding({
                      alertPrefs: selected ? draft.alertPrefs.filter((value) => value !== item) : [...draft.alertPrefs, item],
                    })
                  }
                />
              )
            })}
          </View>
        </View>
      ) : null}

      {current === "avatar" ? (
        <View style={styles.stack}>
          <Text style={styles.sectionLabel}>Choose your avatar</Text>
          <View style={styles.avatarGrid}>
            {avatars.map((avatar) => (
              <Pressable key={avatar} style={[styles.avatarChoice, draft.avatar === avatar && styles.avatarChoiceActive]} onPress={() => updateOnboarding({ avatar })}>
                <Text style={styles.avatarChoiceText}>{avatar}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {current === "finish" ? (
        <View style={styles.stack}>
          <Text style={styles.sectionLabel}>Ready to begin</Text>
          <Text style={styles.bodyText}>We’ll create your real app state, set your active Spore, and carry your preferences into the product shell you just saw in the UI audit.</Text>
          {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
        </View>
      ) : null}

      <View style={styles.actions}>
        {step > 0 ? <SecondaryButton label="Back" onPress={() => setStep((value) => Math.max(0, value - 1))} /> : null}
        <PrimaryButton
          label={submit.isPending ? "Saving..." : current === "finish" ? "Enter Spores" : "Continue"}
          onPress={next}
          disabled={
            submit.isPending ||
            (current === "choice" && !draft.mode) ||
            (current === "consent" && !draft.consentAccepted)
          }
        />
      </View>
    </ScreenView>
  )
}

function ChoiceCard({
  title,
  subtitle,
  selected,
  onPress,
}: {
  title: string
  subtitle: string
  selected: boolean
  onPress: () => void
}) {
  return (
    <Pressable onPress={onPress} style={[styles.choiceCard, selected && styles.choiceCardSelected]}>
      <Text style={[styles.choiceTitle, selected && styles.choiceTitleSelected]}>{title}</Text>
      <Text style={[styles.choiceSubtitle, selected && styles.choiceSubtitleSelected]}>{subtitle}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingTop: 24,
  },
  stack: {
    gap: spacing.md,
  },
  sectionLabel: {
    color: colors.foreground,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    fontWeight: "600",
  },
  bodyText: {
    color: colors.mutedForeground,
    lineHeight: 22,
  },
  signOutLink: {
    alignSelf: "flex-start",
    marginTop: -spacing.md,
  },
  signOutText: {
    color: colors.primary,
    fontWeight: "600",
  },
  errorText: {
    color: colors.destructive,
    lineHeight: 20,
  },
  choiceRow: {
    gap: spacing.md,
  },
  choiceCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: spacing.lg,
  },
  choiceCardSelected: {
    backgroundColor: colors.secondary,
    borderColor: "transparent",
  },
  choiceTitle: {
    color: colors.foreground,
    fontWeight: "600",
    fontSize: 16,
  },
  choiceTitleSelected: {
    color: colors.secondaryForeground,
  },
  choiceSubtitle: {
    color: colors.mutedForeground,
    marginTop: 4,
    lineHeight: 18,
  },
  choiceSubtitleSelected: {
    color: colors.secondaryForeground,
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  avatarChoice: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarChoiceActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
  },
  avatarChoiceText: {
    fontSize: 28,
  },
  actions: {
    gap: spacing.md,
  },
})
