"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Shield } from "lucide-react"
import { useNavigation } from "@/components/mobile-shell"
import { currentSpore, recentActivity, activeChallenges } from "@/lib/store"
import { CheckInFlow } from "@/components/flows/check-in-flow"
import { SporeHealthOrb } from "@/components/ui/spore-health-orb"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function HomeScreen() {
  const { setCurrentScreen, setShowBottomSheet, setBottomSheetContent } = useNavigation()
  const [greeting, setGreeting] = useState("Welcome")

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  const openCheckIn = () => {
    setBottomSheetContent(<CheckInFlow onComplete={() => setShowBottomSheet(false)} />)
    setShowBottomSheet(true)
  }

  return (
    <div className="flex flex-col min-h-full px-5">
      {/* Header */}
      <header className="pt-16 pb-8">
        <p className="text-sm text-muted-foreground tracking-wide">
          {greeting}
        </p>
        <h1 className="text-[1.75rem] font-semibold text-foreground mt-1.5 leading-tight">
          How are you today?
        </h1>
      </header>

      {/* Check-in Card - Hero moment */}
      <section className="mb-8">
        <button
          onClick={openCheckIn}
          className="w-full bg-card rounded-[1.5rem] p-6 text-left group hover:shadow-lg transition-all duration-300"
          style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Daily reflection
          </p>
          <p className="text-lg text-foreground leading-relaxed font-medium">
            Take a quiet moment to notice how you&apos;re feeling
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-primary font-medium">
            <span>Begin check-in</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </section>

      {/* Spore Health - Refined minimal card */}
      <section className="mb-8">
        <button
          onClick={() => setCurrentScreen("spore")}
          className="w-full bg-secondary/50 rounded-[1.5rem] p-5 text-left group"
        >
          <div className="flex items-center gap-5">
            <SporeHealthOrb health={currentSpore.health} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                {currentSpore.name}
              </p>
              <p className="text-xl font-semibold text-foreground">
                {currentSpore.health}%
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {currentSpore.members.length} members · {activeChallenges.length} challenges
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </button>
      </section>

      {/* Recent Activity - Clean list */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">
            Recent
          </h2>
          <button
            onClick={() => setCurrentScreen("spore")}
            className="text-sm text-primary font-medium"
          >
            See all
          </button>
        </div>
        <div className="space-y-1">
          {recentActivity.slice(0, 3).map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      {/* Quick Actions - Refined minimal */}
      <section className="mb-8">
        <div className="flex gap-3">
          <QuickAction
            label="Send support"
            onClick={() => setCurrentScreen("spore")}
          />
          <QuickAction
            label="Join challenge"
            onClick={() => setCurrentScreen("challenges")}
            variant="accent"
          />
        </div>
      </section>

      {/* Safety - Subtle footer */}
      <section className="pb-6 mt-auto">
        <button
          onClick={() => setCurrentScreen("profile")}
          className="w-full flex items-center justify-center gap-2 py-3 text-muted-foreground"
        >
          <Shield className="w-4 h-4" />
          <span className="text-sm">Safety resources</span>
        </button>
      </section>
    </div>
  )
}

interface ActivityRowProps {
  activity: {
    id: string
    type: string
    memberName: string
    content: string
    timestamp: string
  }
}

function ActivityRow({ activity }: ActivityRowProps) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm">
        {activity.memberName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">
          <span className="font-medium">{activity.memberName}</span>
          <span className="text-muted-foreground"> {activity.content}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
      </div>
    </div>
  )
}

interface QuickActionProps {
  label: string
  onClick: () => void
  variant?: "default" | "accent"
}

function QuickAction({ label, onClick, variant = "default" }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 rounded-2xl text-sm font-medium transition-all ${
        variant === "accent"
          ? "bg-accent/50 text-accent-foreground"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {label}
    </button>
  )
}
