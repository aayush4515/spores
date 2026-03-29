"use client"

import { useState } from "react"
import { ChevronLeft, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckInFlowProps {
  onComplete: () => void
}

type CheckInStep = "mood" | "energy" | "stress" | "sleep" | "social" | "reflection" | "complete"

const steps: CheckInStep[] = ["mood", "energy", "stress", "sleep", "social", "reflection", "complete"]

interface StepConfig {
  title: string
  subtitle: string
  labels: [string, string]
}

const stepConfig: Record<Exclude<CheckInStep, "reflection" | "complete">, StepConfig> = {
  mood: {
    title: "How are you feeling?",
    subtitle: "Notice your emotional state right now",
    labels: ["Heavy", "Light"],
  },
  energy: {
    title: "Energy level",
    subtitle: "How energized do you feel?",
    labels: ["Depleted", "Energized"],
  },
  stress: {
    title: "Tension",
    subtitle: "Are you carrying any stress?",
    labels: ["Calm", "Stressed"],
  },
  sleep: {
    title: "Rest",
    subtitle: "How was your sleep?",
    labels: ["Poor", "Restful"],
  },
  social: {
    title: "Social energy",
    subtitle: "Your capacity for connection",
    labels: ["Drained", "Full"],
  },
}

export function CheckInFlow({ onComplete }: CheckInFlowProps) {
  const [currentStep, setCurrentStep] = useState<CheckInStep>("mood")
  const [values, setValues] = useState({
    mood: 5,
    energy: 5,
    stress: 5,
    sleep: 5,
    social: 5,
    reflection: "",
  })

  const currentIndex = steps.indexOf(currentStep)
  const progress = ((currentIndex + 1) / steps.length) * 100

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const goNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const updateValue = (key: keyof typeof values, value: number | string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  if (currentStep === "complete") {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
          <Check className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Reflection complete
        </h2>
        <p className="text-muted-foreground mb-8 max-w-[260px] text-sm leading-relaxed">
          Thank you for taking a moment to check in with yourself.
        </p>
        <button
          onClick={onComplete}
          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm"
        >
          Done
        </button>
      </div>
    )
  }

  if (currentStep === "reflection") {
    return (
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-1.5">
          Anything else?
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Optional. Capture a thought or feeling.
        </p>

        <textarea
          value={values.reflection}
          onChange={(e) => updateValue("reflection", e.target.value)}
          placeholder="Write freely..."
          className="w-full h-28 p-4 rounded-2xl bg-muted border-0 resize-none text-foreground placeholder:text-muted-foreground focus:outline-none text-sm mb-6"
        />

        <div className="flex gap-3">
          <button
            onClick={goNext}
            className="flex-1 py-3.5 rounded-full bg-muted text-foreground font-medium text-sm"
          >
            Skip
          </button>
          <button
            onClick={goNext}
            className="flex-1 py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-sm"
          >
            Complete
          </button>
        </div>
      </div>
    )
  }

  const config = stepConfig[currentStep as keyof typeof stepConfig]
  const value = values[currentStep as keyof typeof values] as number

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {currentIndex > 0 ? (
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-9" />
        )}
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <h2 className="text-xl font-semibold text-foreground mb-1.5">
        {config.title}
      </h2>
      <p className="text-sm text-muted-foreground mb-10">
        {config.subtitle}
      </p>

      {/* Slider - Premium minimal */}
      <div className="mb-10">
        <div className="flex justify-between text-xs text-muted-foreground mb-4 px-1">
          <span>{config.labels[0]}</span>
          <span>{config.labels[1]}</span>
        </div>
        
        <div className="relative py-4">
          {/* Track background */}
          <div className="h-1 bg-muted rounded-full" />
          
          {/* Progress fill */}
          <div
            className="absolute top-4 left-0 h-1 bg-primary rounded-full transition-all duration-200"
            style={{ width: `${value * 10}%` }}
          />
          
          {/* Touch targets */}
          <div className="absolute inset-0 flex justify-between items-center">
            {Array.from({ length: 11 }).map((_, i) => (
              <button
                key={i}
                onClick={() => updateValue(currentStep as keyof typeof values, i)}
                className="w-8 h-8 flex items-center justify-center -mx-1"
              >
                <div
                  className={cn(
                    "rounded-full transition-all duration-200",
                    i === value
                      ? "w-5 h-5 bg-primary shadow-lg"
                      : i < value
                      ? "w-2 h-2 bg-primary"
                      : "w-2 h-2 bg-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Value display */}
        <div className="text-center mt-6">
          <span className="text-4xl font-semibold text-foreground tabular-nums">
            {value}
          </span>
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={goNext}
        className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-sm"
      >
        Continue
      </button>
    </div>
  )
}
