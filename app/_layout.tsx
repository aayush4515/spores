import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { AppProviders } from "@/src/components/layout/AppProviders"
import { colors } from "@/src/theme/tokens"

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="spore/[id]" />
        <Stack.Screen
          name="modals/check-in"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="modals/appreciation"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="modals/observation"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="modals/new-challenge"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="modals/challenge/[id]"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="modals/member/[id]"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="modals/avatar"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="modals/safety"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="modals/hangout"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="modals/invite"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
      </Stack>
    </AppProviders>
  )
}
