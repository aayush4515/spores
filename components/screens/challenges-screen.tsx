"use client"

import { useState } from "react"
import { Plus, Check, Users, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/components/mobile-shell"
import { activeChallenges, challengeTemplates, currentSpore } from "@/lib/store"
import { SporeHealthOrb } from "@/components/ui/spore-health-orb"
import { ChallengeDetailSheet } from "@/components/flows/challenge-detail-sheet"
import { NewChallengeFlow } from "@/components/flows/new-challenge-flow"

export function ChallengesScreen() {
  const { setShowBottomSheet, setBottomSheetContent } = useNavigation()
  const [filter, setFilter] = useState<"active" | "completed">("active")

  const openChallengeDetail = (challenge: typeof activeChallenges[0]) => {
    setBottomSheetContent(
      <ChallengeDetailSheet 
        challenge={challenge} 
        onClose={() => setShowBottomSheet(false)} 
      />
    )
    setShowBottomSheet(true)
  }

  const openNewChallenge = () => {
    setBottomSheetContent(
      <NewChallengeFlow onComplete={() => setShowBottomSheet(false)} />
    )
    setShowBottomSheet(true)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="px-5 pt-16 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[1.75rem] font-semibold text-foreground leading-tight">
              Grow together
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Every challenge nourishes your Spore
            </p>
          </div>
          <SporeHealthOrb health={currentSpore.health} size="sm" />
        </div>
      </header>

      {/* Spore Impact Card - Subtle */}
      <section className="px-5 mb-6">
        <div className="bg-secondary/60 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Spore wellness
              </p>
              <p className="text-2xl font-semibold text-foreground mt-1">
                {currentSpore.health}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">This month</p>
              <p className="text-sm font-medium text-primary mt-1">
                12 completed
              </p>
            </div>
          </div>
          <div className="mt-4 h-1 bg-background/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${currentSpore.health}%` }}
            />
          </div>
        </div>
      </section>

      {/* Filter Tabs - Minimal pills */}
      <section className="px-5 mb-5">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("active")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              filter === "active"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground"
            )}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              filter === "completed"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground"
            )}
          >
            Completed
          </button>
        </div>
      </section>

      {/* Challenges List */}
      <section className="px-5 mb-8 flex-1">
        <div className="space-y-3">
          {activeChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onClick={() => openChallengeDetail(challenge)}
            />
          ))}
        </div>
      </section>

      {/* Quick Start - Horizontal chips */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wide px-5 mb-3">
          Quick start
        </h2>
        <div className="flex gap-2 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {challengeTemplates.slice(0, 6).map((template) => (
            <button
              key={template.id}
              onClick={openNewChallenge}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-card rounded-full border border-border"
            >
              <span className="text-base">{template.icon}</span>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {template.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Create Button */}
      <section className="px-5 pb-6">
        <button
          onClick={openNewChallenge}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Create challenge
        </button>
      </section>
    </div>
  )
}

interface ChallengeCardProps {
  challenge: typeof activeChallenges[0]
  onClick: () => void
}

function ChallengeCard({ challenge, onClick }: ChallengeCardProps) {
  const progress = (challenge.completedBy.length / challenge.participants.length) * 100
  const isCompleted = challenge.completedBy.includes("user-1")

  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-2xl p-5 text-left group"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl flex-shrink-0">
          {challenge.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground">{challenge.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
            {challenge.description}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              progress === 100 ? "bg-primary" : "bg-primary/70"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-foreground">
          {challenge.completedBy.length}/{challenge.participants.length}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {challenge.participants.length}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {challenge.duration}
          </span>
        </div>
        {isCompleted ? (
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            <Check className="w-3.5 h-3.5" />
            Done
          </span>
        ) : (
          <span className="text-xs font-medium text-primary">
            Mark complete
          </span>
        )}
      </div>
    </button>
  )
}
