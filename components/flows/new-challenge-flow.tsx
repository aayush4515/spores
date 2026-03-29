"use client"

import { useState } from "react"
import { ChevronLeft, Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { challengeTemplates, sporeMembers } from "@/lib/store"

interface NewChallengeFlowProps {
  onComplete: () => void
}

type Step = "template" | "customize" | "invite" | "created"

export function NewChallengeFlow({ onComplete }: NewChallengeFlowProps) {
  const [step, setStep] = useState<Step>("template")
  const [selectedTemplate, setSelectedTemplate] = useState<typeof challengeTemplates[0] | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("7 days")
  const [invitedMembers, setInvitedMembers] = useState<string[]>([])

  const handleSelectTemplate = (template: typeof challengeTemplates[0]) => {
    setSelectedTemplate(template)
    setTitle(template.title)
    setDescription("")
    setStep("customize")
  }

  const handleToggleMember = (memberId: string) => {
    setInvitedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleCreate = () => {
    setStep("created")
    setTimeout(onComplete, 2000)
  }

  if (step === "created") {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-5">
          <Check className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Challenge created
        </h2>
        <p className="text-sm text-muted-foreground">
          Your Spore has been invited
        </p>
      </div>
    )
  }

  if (step === "invite") {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setStep("customize")}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-foreground">Invite members</span>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 mb-5">
          <span className="text-xl">{selectedTemplate?.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{title}</p>
            <p className="text-xs text-muted-foreground">{duration}</p>
          </div>
        </div>

        {/* Members */}
        <div className="space-y-2 mb-5">
          {sporeMembers.map((member) => {
            const isSelected = invitedMembers.includes(member.id)
            return (
              <button
                key={member.id}
                onClick={() => handleToggleMember(member.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                  isSelected ? "bg-secondary" : "bg-muted/50"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-lg">
                  {member.avatar}
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">{member.name}</span>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    isSelected ? "bg-primary border-primary" : "border-border"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleCreate}
          disabled={invitedMembers.length === 0}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-medium text-sm transition-all",
            invitedMembers.length > 0
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Plus className="w-4 h-4" />
          Create
        </button>
      </div>
    )
  }

  if (step === "customize") {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setStep("template")}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-foreground">Customize</span>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-3xl">
            {selectedTemplate?.icon}
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
            Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
            placeholder="Challenge name"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-20 px-4 py-3 rounded-xl bg-muted resize-none text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
            placeholder="Optional details"
          />
        </div>

        {/* Duration */}
        <div className="mb-5">
          <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
            Duration
          </label>
          <div className="flex gap-2">
            {["3 days", "7 days", "14 days", "30 days"].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-xs font-medium transition-all",
                  duration === d
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setStep("invite")}
          disabled={!title.trim()}
          className={cn(
            "w-full py-3.5 rounded-full font-medium text-sm transition-all",
            title.trim()
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          Next
        </button>
      </div>
    )
  }

  // Template selection
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold text-foreground mb-1">
        New challenge
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        Pick a template to start
      </p>

      {/* Templates - Compact grid */}
      <div className="grid grid-cols-3 gap-2">
        {challengeTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className="flex flex-col items-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all"
          >
            <span className="text-2xl mb-1.5">{template.icon}</span>
            <span className="text-xs font-medium text-foreground text-center leading-tight">
              {template.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
