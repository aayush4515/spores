import * as Location from "expo-location"
import { useMutation, useQuery } from "@tanstack/react-query"
import { demoData } from "@/src/mocks/data/demo"
import { queryClient } from "@/src/lib/query-client"
import { shouldUseDemoData } from "@/src/lib/runtime"
import { supabase } from "@/src/lib/supabase"
import { useAppStore } from "@/src/store/app-store"
import type { ProviderKey } from "@/src/types/domain"

export async function fetchTrackingStatus() {
  if (shouldUseDemoData()) return demoData.getTrackingStatus()
  const { data, error } = await supabase!.from("passive_provider_status").select("*")
  if (error) throw error
  return data ?? []
}

export async function collectPassiveSignals() {
  if (shouldUseDemoData()) return demoData.collectSignals()
  const profileId = useAppStore.getState().auth.profile?.id
  const activeSporeId = useAppStore.getState().activeSporeId

  const locationPermission = await Location.requestForegroundPermissionsAsync()
  if (locationPermission.status !== "granted") {
    return []
  }

  const position = await Location.getCurrentPositionAsync({})
  const payload = [
    {
      user_id: profileId,
      spore_id: activeSporeId,
      provider_key: "location",
      metric_name: "latitude",
      metric_value: position.coords.latitude,
      summary: "Current consented foreground location captured.",
    },
    {
      user_id: profileId,
      spore_id: activeSporeId,
      provider_key: "location",
      metric_name: "longitude",
      metric_value: position.coords.longitude,
      summary: "Current consented foreground location captured.",
    },
  ]
  const { data, error } = await supabase!.from("passive_signal_events").insert(payload).select()
  if (error) throw error
  return data ?? []
}

export async function setProviderEnabled(key: ProviderKey, enabled: boolean) {
  if (shouldUseDemoData()) {
    const next = await demoData.setProviderEnabled(key, enabled)
    useAppStore.getState().setProviderStatuses(next)
    return next
  }

  const profileId = useAppStore.getState().auth.profile?.id
  const { error } = await supabase!.from("user_provider_settings").upsert({
    user_id: profileId,
    provider_key: key,
    enabled,
  })
  if (error) throw error
  return true
}

export function useTrackingStatus() {
  return useQuery({
    queryKey: ["tracking-status"],
    queryFn: fetchTrackingStatus,
  })
}

export function useCollectPassiveSignals() {
  return useMutation({
    mutationFn: collectPassiveSignals,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tracking-status"] }),
        queryClient.invalidateQueries({ queryKey: ["home-summary"] }),
      ])
    },
  })
}

export function useSetProviderEnabled() {
  return useMutation({
    mutationFn: ({ key, enabled }: { key: ProviderKey; enabled: boolean }) => setProviderEnabled(key, enabled),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tracking-status"] })
    },
  })
}
