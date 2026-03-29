import { hasSupabaseConfig } from "@/src/lib/env"
import { useAppStore } from "@/src/store/app-store"

export function shouldUseDemoData() {
  const forceDemo = useAppStore.getState().featureFlags.demoMode
  return forceDemo || !hasSupabaseConfig
}

export function getActiveSporeId(fallbackId?: string) {
  return useAppStore.getState().activeSporeId ?? fallbackId
}
