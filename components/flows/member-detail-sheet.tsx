"use client"

import { useState } from "react"
import { Heart, Eye, Sparkles, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppreciationFlow } from "./appreciation-flow"
import { ObservationFlow } from "./observation-flow"
import { useNavigation } from "@/components/mobile-shell"
import type { Member } from "@/lib/store"

interface MemberDetailSheetProps {
  member: Member
  onClose: () => void
}

export function MemberDetailSheet({ member, onClose }: MemberDetailSheetProps) {
  const { setBottomSheetContent } = useNavigation()
  const [currentView, setCurrentView] = useState<"main" | "appreciation" | "observation">("main")

  const statusLabels = {
    thriving: "Thriving",
    okay: "Doing okay",
    "needs-support": "May need support",
    unknown: "Unknown",
  }

  if (currentView === "appreciation") {
    return (
      <AppreciationFlow 
        member={member} 
        onComplete={() => setCurrentView("main")} 
      />
    )
  }

  if (currentView === "observation") {
    return (
      <ObservationFlow 
        member={member} 
        onComplete={() => setCurrentView("main")} 
      />
    )
  }

  return (
    <div className="flex flex-col">
      {/* Profile Header - Centered minimal */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl mb-3">
          {member.avatar}
        </div>
        <h2 className="text-lg font-semibold text-foreground">{member.name}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {statusLabels[member.status]} · {member.lastSeen}
        </p>
      </div>

      {/* Support Preferences - Inline pills */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Prefers support via
        </p>
        <div className="flex flex-wrap gap-1.5">
          {member.supportPreferences.map((pref, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-muted rounded-full text-xs text-muted-foreground"
            >
              {pref}
            </span>
          ))}
        </div>
      </div>

      {/* Care Summary - Minimal grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-muted/50 rounded-xl">
          <p className="text-xs text-muted-foreground">Recent mood</p>
          <p className="text-sm font-medium text-foreground mt-0.5">
            {member.mood ? `${member.mood}/10` : "—"}
          </p>
        </div>
        <div className="p-3 bg-muted/50 rounded-xl">
          <p className="text-xs text-muted-foreground">Challenges</p>
          <p className="text-sm font-medium text-foreground mt-0.5">3 active</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-xl">
          <p className="text-xs text-muted-foreground">Support</p>
          <p className="text-sm font-medium text-foreground mt-0.5">5 this week</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-xl">
          <p className="text-xs text-muted-foreground">Last check-in</p>
          <p className="text-sm font-medium text-foreground mt-0.5">Yesterday</p>
        </div>
      </div>

      {/* Quick Actions - Clean buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <ActionButton
          icon={Heart}
          label="Send support"
          onClick={() => setCurrentView("appreciation")}
          primary
        />
        <ActionButton
          icon={Eye}
          label="Observation"
          onClick={() => setCurrentView("observation")}
        />
        <ActionButton
          icon={Sparkles}
          label="Invite to challenge"
          onClick={() => {}}
        />
        <ActionButton
          icon={Calendar}
          label="Suggest hangout"
          onClick={() => {}}
        />
      </div>

      {/* Privacy Note */}
      <p className="text-xs text-center text-muted-foreground">
        All support actions respect consent preferences
      </p>
    </div>
  )
}

interface ActionButtonProps {
  icon: typeof Heart
  label: string
  onClick: () => void
  primary?: boolean
}

function ActionButton({ icon: Icon, label, onClick, primary }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all",
        primary
          ? "bg-secondary text-secondary-foreground"
          : "bg-muted/50 text-foreground"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}
