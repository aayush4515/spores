import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { useEffect, useRef } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { demoData } from "@/src/mocks/data/demo"
import { queryClient } from "@/src/lib/query-client"
import { shouldUseDemoData } from "@/src/lib/runtime"
import { supabase } from "@/src/lib/supabase"
import { useAppStore } from "@/src/store/app-store"
import type { DemoNotificationInput, NotificationLog } from "@/src/types/domain"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

function mapNotification(item: any): NotificationLog {
  return {
    id: item.id,
    title: item.title,
    body: item.body,
    createdAt: item.created_at ?? item.createdAt,
    kind: item.kind,
    metadata: item.metadata ?? {},
  }
}

export async function fetchNotifications() {
  if (shouldUseDemoData()) return demoData.getNotifications()
  if (!supabase) throw new Error("Supabase is not configured.")
  const { data, error } = await supabase
    .from("notifications_log")
    .select("id, title, body, kind, metadata, created_at")
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapNotification)
}

export async function registerPushToken() {
  if (!Device.isDevice) return null
  const settings = await Notifications.getPermissionsAsync()
  let finalStatus = settings.status
  if (finalStatus !== "granted") {
    const request = await Notifications.requestPermissionsAsync()
    finalStatus = request.status
  }
  if (finalStatus !== "granted") {
    return null
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    undefined
  const token = (await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined)).data
  useAppStore.getState().setPushToken(token)

  if (shouldUseDemoData()) {
    await demoData.registerPush(token)
    return token
  }

  if (!supabase) throw new Error("Supabase is not configured.")
  const { error } = await supabase.rpc("register_push_subscription", {
    expo_push_token: token,
    device_platform: Device.osName ?? "ios",
  })
  if (error) throw error
  return token
}

export async function sendDemoNotification(input: DemoNotificationInput) {
  if (shouldUseDemoData()) return demoData.sendDemoNotification(input)
  if (!supabase) throw new Error("Supabase is not configured.")
  const { data, error } = await supabase.functions.invoke("send-demo-notification", {
    body: input,
  })
  if (error) throw error
  return data
}

export function useNotifications(options?: { enabled?: boolean; refetchInterval?: number | false }) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: options?.enabled,
    refetchInterval: options?.refetchInterval,
  })
}

export function useRegisterPushToken() {
  return useMutation({
    mutationFn: registerPushToken,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useSendDemoNotification() {
  return useMutation({
    mutationFn: sendDemoNotification,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

let localNotificationPermissionRequested = false

async function ensureLocalNotificationPermission() {
  const settings = await Notifications.getPermissionsAsync()
  let finalStatus = settings.status
  if (finalStatus !== "granted" && !localNotificationPermissionRequested) {
    localNotificationPermissionRequested = true
    const request = await Notifications.requestPermissionsAsync()
    finalStatus = request.status
  }
  return finalStatus === "granted"
}

async function scheduleMirroredLocalNotification(notification: NotificationLog) {
  if (Device.isDevice) return
  const permitted = await ensureLocalNotificationPermission()
  if (!permitted) return
  await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      data: notification.metadata ?? {},
    },
    trigger: null,
  })
}

export function NotificationRuntimeEffects() {
  const auth = useAppStore((state) => state.auth)
  const initialized = useRef(false)
  const seenIds = useRef<Set<string>>(new Set())
  const { data: notifications = [] } = useNotifications({
    enabled: auth.status === "authenticated",
    refetchInterval: auth.status === "authenticated" ? 4000 : false,
  })

  useEffect(() => {
    if (auth.status !== "authenticated") {
      initialized.current = false
      seenIds.current = new Set()
      return
    }

    if (!notifications.length) return

    if (!initialized.current) {
      seenIds.current = new Set(notifications.map((item) => item.id))
      initialized.current = true
      return
    }

    const newNotifications = notifications.filter((item) => !seenIds.current.has(item.id))
    if (!newNotifications.length) return

    newNotifications.forEach((item) => {
      seenIds.current.add(item.id)
    })

    newNotifications
      .slice()
      .reverse()
      .forEach((item) => {
        void scheduleMirroredLocalNotification(item)
      })
  }, [auth.status, notifications])

  return null
}
