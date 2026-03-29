"use client"

import { Phone, MessageCircle, Heart, Leaf, Wind, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface SafetyResourcesSheetProps {
  onClose: () => void
}

export function SafetyResourcesSheet({ onClose }: SafetyResourcesSheetProps) {
  const crisisResources = [
    {
      name: "Crisis Text Line",
      description: "Text HOME to 741741",
      icon: MessageCircle,
      action: "sms:741741",
    },
    {
      name: "988 Lifeline",
      description: "Call or text 988",
      icon: Phone,
      action: "tel:988",
    },
  ]

  const groundingExercises = [
    { icon: Wind, label: "Breathing", duration: "3 min" },
    { icon: Leaf, label: "5-4-3-2-1 grounding", duration: "5 min" },
    { icon: Heart, label: "Self-compassion", duration: "2 min" },
  ]

  return (
    <div className="flex flex-col">
      {/* Header - Warm */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-secondary mx-auto flex items-center justify-center mb-3">
          <Heart className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          You&apos;re not alone
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Support is here when you need it
        </p>
      </div>

      {/* Crisis Resources - Clear CTAs */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Immediate support
        </p>
        <div className="space-y-2">
          {crisisResources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <a
                key={index}
                href={resource.action}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-secondary text-secondary-foreground"
              >
                <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{resource.name}</p>
                  <p className="text-xs text-secondary-foreground/70">{resource.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-secondary-foreground/50" />
              </a>
            )
          })}
        </div>
      </div>

      {/* Trusted Contacts */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Trusted contacts
        </p>
        <div className="p-4 rounded-xl bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            No contacts added yet
          </p>
          <button className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground">
            Add contact
          </button>
        </div>
      </div>

      {/* Grounding Tools - Simple list */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Grounding exercises
        </p>
        <div className="space-y-1.5">
          {groundingExercises.map((exercise, index) => {
            const Icon = exercise.icon
            return (
              <button
                key={index}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 text-left"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="flex-1 text-sm text-foreground">{exercise.label}</span>
                <span className="text-xs text-muted-foreground">{exercise.duration}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Reassurance */}
      <p className="text-xs text-center text-muted-foreground leading-relaxed">
        Asking for help is strength
      </p>
    </div>
  )
}
