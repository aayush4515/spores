"use client"

import { useState } from "react"
import { ChevronRight, Heart, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/components/mobile-shell"
import { currentSpore, sporeMembers, recentActivity, activeChallenges } from "@/lib/store"
import { SporeHealthOrb } from "@/components/ui/spore-health-orb"
import { MemberDetailSheet } from "@/components/flows/member-detail-sheet"
import { AppreciationFlow } from "@/components/flows/appreciation-flow"

export function SporeScreen() {
  const { setCurrentScreen, setShowBottomSheet, setBottomSheetContent } = useNavigation()

  const openMemberDetail = (member: typeof sporeMembers[0]) => {
    setBottomSheetContent(
      <MemberDetailSheet 
        member={member} 
        onClose={() => setShowBottomSheet(false)} 
      />
    )
    setShowBottomSheet(true)
  }

  const openAppreciation = () => {
    setBottomSheetContent(
      <AppreciationFlow onComplete={() => setShowBottomSheet(false)} />
    )
    setShowBottomSheet(true)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header - Clean hero with orb */}
      <header className="px-5 pt-16 pb-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Your circle
            </p>
            <h1 className="text-[1.75rem] font-semibold text-foreground leading-tight">
              {currentSpore.name}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {currentSpore.members.length} members growing together
            </p>
          </div>
          <SporeHealthOrb health={currentSpore.health} size="lg" />
        </div>
        
        {/* Wellness bar - minimal */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Spore wellness</span>
            <span className="font-medium text-foreground">{currentSpore.health}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${currentSpore.health}%` }}
            />
          </div>
          <p className="text-xs text-primary mt-2">+8% from challenges this week</p>
        </div>
      </header>

      {/* Members - Horizontal scroll */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wide px-5 mb-4">
          Members
        </h2>
        <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {sporeMembers.map((member) => (
            <MemberPill
              key={member.id}
              member={member}
              onClick={() => openMemberDetail(member)}
            />
          ))}
        </div>
      </section>

      {/* Active Challenges - Clean cards */}
      <section className="px-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">
            Challenges
          </h2>
          <button
            onClick={() => setCurrentScreen("challenges")}
            className="text-sm text-primary font-medium flex items-center gap-0.5"
          >
            All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {activeChallenges.slice(0, 2).map((challenge) => (
            <ChallengeRow
              key={challenge.id}
              challenge={challenge}
              onClick={() => setCurrentScreen("challenges")}
            />
          ))}
        </div>
      </section>

      {/* Support Feed - Minimal list */}
      <section className="px-5 mb-8 flex-1">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wide mb-4">
          Recent support
        </h2>
        <div className="space-y-1">
          {recentActivity.slice(0, 4).map((activity) => (
            <SupportRow key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      {/* Action Buttons - Floating style */}
      <section className="px-5 pb-6">
        <div className="flex gap-3">
          <button
            onClick={openAppreciation}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-card border border-border text-foreground font-medium text-sm"
          >
            <Heart className="w-4 h-4" />
            Send support
          </button>
          <button
            onClick={() => setCurrentScreen("challenges")}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            New challenge
          </button>
        </div>
      </section>
    </div>
  )
}

interface MemberPillProps {
  member: typeof sporeMembers[0]
  onClick: () => void
}

function MemberPill({ member, onClick }: MemberPillProps) {
  const statusColors = {
    thriving: "ring-2 ring-primary/30",
    okay: "ring-2 ring-muted",
    "needs-support": "ring-2 ring-warmth",
    unknown: "ring-2 ring-muted/50",
  }

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex flex-col items-center gap-2 w-16"
    >
      <div className={cn(
        "w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-xl",
        statusColors[member.status]
      )}>
        {member.avatar}
      </div>
      <span className="text-xs text-foreground font-medium truncate w-full text-center">
        {member.name.split(" ")[0]}
      </span>
    </button>
  )
}

interface ChallengeRowProps {
  challenge: typeof activeChallenges[0]
  onClick: () => void
}

function ChallengeRow({ challenge, onClick }: ChallengeRowProps) {
  const progress = (challenge.completedBy.length / challenge.participants.length) * 100

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl text-left group"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}
    >
      <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-lg flex-shrink-0">
        {challenge.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm truncate">{challenge.title}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {challenge.completedBy.length}/{challenge.participants.length}
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </button>
  )
}

interface SupportRowProps {
  activity: typeof recentActivity[0]
}

function SupportRow({ activity }: SupportRowProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
        {activity.memberName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">
          <span className="font-medium">{activity.memberName}</span>
          <span className="text-muted-foreground"> {activity.content}</span>
        </p>
      </div>
      <span className="text-xs text-muted-foreground flex-shrink-0">{activity.timestamp}</span>
    </div>
  )
}
