import { PropsWithChildren, useEffect } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { bootstrapSession, getAuthenticatedProfile } from "@/src/features/auth/api"
import { NotificationRuntimeEffects } from "@/src/features/notifications/api"
import { queryClient } from "@/src/lib/query-client"
import { supabase } from "@/src/lib/supabase"
import { useAppStore } from "@/src/store/app-store"

export function AppProviders({ children }: PropsWithChildren) {
  const setAuth = useAppStore((state) => state.setAuth)

  useEffect(() => {
    let isMounted = true
    const bootTimeout = setTimeout(() => {
      if (isMounted) {
        setAuth({ status: "signedOut", profile: null })
      }
    }, 8000)

    bootstrapSession()
      .then((auth) => {
        if (isMounted) {
          clearTimeout(bootTimeout)
          setAuth(auth)
        }
      })
      .catch(() => {
        if (isMounted) {
          clearTimeout(bootTimeout)
          setAuth({ status: "signedOut", profile: null })
        }
      })

    const authSubscription = supabase?.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return

      if (!session?.user) {
        setAuth({ status: "signedOut", profile: null })
        return
      }

      try {
        const profile = await getAuthenticatedProfile()
        setAuth({ status: "authenticated", profile })
      } catch {
        setAuth({ status: "signedOut", profile: null })
      }
    })

    return () => {
      isMounted = false
      clearTimeout(bootTimeout)
      authSubscription?.data.subscription.unsubscribe()
    }
  }, [setAuth])

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationRuntimeEffects />
        {children}
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}
