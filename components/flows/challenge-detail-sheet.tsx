"use client"

import { useState } from "react"
import { Check, Users, Clock, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { sporeMembers, type Challenge } from "@/lib/store"

interface ChallengeDetailSheetProps {
  challenge: Challenge
  onClose: () => void
}

export function ChallengeDetailSheet({ challenge, onClose }: ChallengeDetailSheetProps) {
  const [isCompleted, setIsCompleted] = useState(challenge.completedBy.includes("user-1"))
  const [showCelebration, setShowCelebration] = useState(false)

  const progress = (challenge.completedBy.length / challenge.participants.length) * 100
  const participants = sporeMembers.filter((m) => 
    challenge.participants.includes(m.id)
  )

  const handleComplete = () => {
    setIsCompleted(true)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2500)
  }

  if (showCelebration) {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-5">
          <Check className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Well done
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Your Spore grows stronger
        </p>
        <span className="text-sm font-medium text-primary">+5% wellness</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5 pb-5 border-b border-border">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl flex-shrink-0">
          {challenge.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground">
            {challenge.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {challenge.description}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">
            {challenge.completedBy.length}/{challenge.participants.length}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">Joined</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {challenge.participants.length} members
          </p>
        </div>
        <div className="flex-1 p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">Duration</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {challenge.duration}
          </p>
        </div>
      </div>

      {/* Participants */}
      <div className="mb-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Participants
        </p>
        <div className="flex flex-wrap gap-1.5">
          {participants.map((member) => {
            const completed = challenge.completedBy.includes(member.id)
            return (
              <div
                key={member.id}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm",
                  completed
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <span className="text-sm">{member.avatar}</span>
                <span className="text-xs font-medium">{member.name.split(" ")[0]}</span>
                {completed && <Check className="w-3 h-3" />}
              </div>
            )
          })}
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm",
              isCompleted
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <span className="text-sm">You</span>
            {isCompleted && <Check className="w-3 h-3" />}
          </div>
        </div>
      </div>

      {/* Spore Impact - Subtle */}
      <div className="p-3 rounded-xl bg-secondary/50 mb-5">
        <p className="text-xs text-center text-secondary-foreground">
          Completing adds +5% to Spore wellness
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-muted text-foreground font-medium text-sm">
          <Share2 className="w-4 h-4" />
          Invite
        </button>
        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-medium text-sm transition-all",
            isCompleted
              ? "bg-primary text-primary-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          <Check className="w-4 h-4" />
          {isCompleted ? "Done" : "Complete"}
        </button>
      </div>
    </div>
  )
}
