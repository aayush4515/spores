"use client"

import { useState } from "react"
import { ChevronRight, Shield, Bell, Eye, Heart, Phone, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/components/mobile-shell"
import { currentUser, recentCheckIns } from "@/lib/store"
import { SafetyResourcesSheet } from "@/components/flows/safety-resources-sheet"
import { AvatarCustomizeSheet } from "@/components/flows/avatar-customize-sheet"

export function ProfileScreen() {
  const { setShowBottomSheet, setBottomSheetContent } = useNavigation()
  const [avatarEvolution] = useState(3)

  const openSafetyResources = () => {
    setBottomSheetContent(
      <SafetyResourcesSheet onClose={() => setShowBottomSheet(false)} />
    )
    setShowBottomSheet(true)
  }

  const openAvatarCustomize = () => {
    setBottomSheetContent(
      <AvatarCustomizeSheet onClose={() => setShowBottomSheet(false)} />
    )
    setShowBottomSheet(true)
  }

  return (
    <div className="flex flex-col min-h-full px-5">
      {/* Header */}
      <header className="pt-16 pb-8">
        <h1 className="text-[1.75rem] font-semibold text-foreground leading-tight">
          Your space
        </h1>
      </header>

      {/* Avatar Card - Clean elegant */}
      <section className="mb-8">
        <button
          onClick={openAvatarCustomize}
          className="w-full bg-secondary/60 rounded-2xl p-5 text-left group"
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center text-3xl border border-border">
                {currentUser.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-medium text-primary-foreground">{avatarEvolution}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Your avatar
              </p>
              <p className="font-medium text-foreground">Growing strong</p>
              <div className="flex gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      i < avatarEvolution ? "bg-primary" : "bg-muted-foreground/20"
                    )}
                  />
                ))}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>
      </section>

      {/* Wellness Summary - Minimal cards */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wide mb-4">
          Your wellness
        </h2>
        <div className="flex gap-3">
          <WellnessMetric
            label="Mood"
            value={recentCheckIns[0]?.mood || 0}
            trend="up"
          />
          <WellnessMetric
            label="Energy"
            value={recentCheckIns[0]?.energy || 0}
            trend="stable"
          />
          <WellnessMetric
            label="Sleep"
            value={recentCheckIns[0]?.sleep || 0}
            trend="up"
          />
        </div>
      </section>

      {/* Privacy Settings - Clean list */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wide mb-4">
          Privacy
        </h2>
        <div className="bg-card rounded-2xl divide-y divide-border/50" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
          <SettingsRow icon={Eye} label="What others see" />
          <SettingsRow icon={Bell} label="Notifications" />
          <SettingsRow icon={Heart} label="Support preferences" />
          <SettingsRow icon={Shield} label="Tracked signals" />
        </div>
      </section>

      {/* Safety - Prominent */}
      <section className="mb-8">
        <button
          onClick={openSafetyResources}
          className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-primary/20 text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Safety resources</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Immediate support & contacts
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </button>
      </section>

      {/* App Settings - Subtle */}
      <section className="pb-6">
        <div className="bg-card rounded-2xl divide-y divide-border/50" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
          <SettingsRow icon={Settings} label="App settings" />
        </div>
      </section>
    </div>
  )
}

interface WellnessMetricProps {
  label: string
  value: number
  trend: "up" | "down" | "stable"
}

function WellnessMetric({ label, value, trend }: WellnessMetricProps) {
  return (
    <div className="flex-1 bg-card rounded-2xl p-4 text-center" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
      <p className="text-xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      <p
        className={cn(
          "text-xs font-medium mt-1",
          trend === "up" ? "text-primary" : 
          trend === "down" ? "text-destructive" : 
          "text-muted-foreground"
        )}
      >
        {trend === "up" ? "+" : trend === "down" ? "-" : ""}
      </p>
    </div>
  )
}

interface SettingsRowProps {
  icon: typeof Eye
  label: string
}

function SettingsRow({ icon: Icon, label }: SettingsRowProps) {
  return (
    <button className="w-full flex items-center gap-4 p-4 text-left group">
      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
        <Icon className="w-4 h-4 text-foreground" />
      </div>
      <span className="flex-1 font-medium text-foreground text-sm">{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
    </button>
  )
}
