"use client"

import { useState } from "react"
import { ChevronLeft, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { observationOptions, type Member } from "@/lib/store"

interface ObservationFlowProps {
  member: Member
  onComplete: () => void
}

export function ObservationFlow({ member, onComplete }: ObservationFlowProps) {
  const [step, setStep] = useState<"select" | "details" | "submitted">("select")
  const [selectedObservation, setSelectedObservation] = useState<typeof observationOptions[0] | null>(null)
  const [confidence, setConfidence] = useState<"unsure" | "somewhat" | "confident">("somewhat")
  const [note, setNote] = useState("")

  const handleSubmit = () => {
    setStep("submitted")
    setTimeout(onComplete, 2000)
  }

  if (step === "submitted") {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-5">
          <Check className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Shared with care
        </h2>
        <p className="text-sm text-muted-foreground max-w-[220px]">
          Your observation helps the Spore support {member.name}
        </p>
      </div>
    )
  }

  if (step === "details") {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setStep("select")}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-foreground">Details</span>
        </div>

        {/* Selected */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 mb-5">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full",
              selectedObservation?.severity === "positive" ? "bg-primary" :
              selectedObservation?.severity === "moderate" ? "bg-warmth" : "bg-muted-foreground"
            )}
          />
          <span className="text-sm text-foreground">{selectedObservation?.label}</span>
        </div>

        {/* Confidence */}
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Confidence
          </p>
          <div className="flex gap-2">
            {(["unsure", "somewhat", "confident"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setConfidence(level)}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-xs font-medium transition-all capitalize",
                  confidence === level
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Note (optional)
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any context..."
            className="w-full h-20 p-3 rounded-xl bg-muted resize-none text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
          />
        </div>

        {/* Privacy */}
        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
          {member.name} may be notified gently, without specifics.
        </p>

        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-sm"
        >
          Share
        </button>
      </div>
    )
  }

  // Selection
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold text-foreground mb-1">
        Share observation
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        How does {member.name} seem lately?
      </p>

      {/* Member */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-5">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
          {member.avatar}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{member.name}</p>
          <p className="text-xs text-muted-foreground">{member.lastSeen}</p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-1.5 mb-5">
        {observationOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              setSelectedObservation(option)
              setStep("details")
            }}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-muted/50 hover:bg-muted transition-all text-left"
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                option.severity === "positive" ? "bg-primary" :
                option.severity === "moderate" ? "bg-warmth" : "bg-muted-foreground"
              )}
            />
            <span className="text-sm text-foreground">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Note */}
      <p className="text-xs text-center text-muted-foreground">
        Observations are about support, not surveillance
      </p>
    </div>
  )
}
