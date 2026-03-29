import { Redirect } from "expo-router"
import { ActivityIndicator, View } from "react-native"
import { useAppStore } from "@/src/store/app-store"
import { colors } from "@/src/theme/tokens"

export default function IndexScreen() {
  const auth = useAppStore((state) => state.auth)

  if (auth.status === "booting") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  if (auth.status === "signedOut" || !auth.profile) {
    return <Redirect href="/(auth)/welcome" />
  }

  if (!auth.profile.onboardingCompleted) {
    return <Redirect href="/(onboarding)" />
  }

  return <Redirect href="/(tabs)/home" />
}
