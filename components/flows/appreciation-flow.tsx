"use client"

import { useState } from "react"
import { ChevronLeft, Check, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { sporeMembers, appreciationMessages, type Member } from "@/lib/store"

interface AppreciationFlowProps {
  member?: Member
  onComplete: () => void
}

export function AppreciationFlow({ member, onComplete }: AppreciationFlowProps) {
  const [step, setStep] = useState<"recipient" | "message" | "custom" | "sent">(
    member ? "message" : "recipient"
  )
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(member)
  const [selectedMessage, setSelectedMessage] = useState<typeof appreciationMessages[0] | null>(null)
  const [customMessage, setCustomMessage] = useState("")

  const handleSelectMember = (m: Member) => {
    setSelectedMember(m)
    setStep("message")
  }

  const handleSelectMessage = (msg: typeof appreciationMessages[0]) => {
    setSelectedMessage(msg)
  }

  const handleSend = () => {
    setStep("sent")
    setTimeout(onComplete, 2000)
  }

  if (step === "sent") {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-5 text-2xl">
          {selectedMessage?.icon || "💚"}
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Sent with care
        </h2>
        <p className="text-sm text-muted-foreground max-w-[240px]">
          {selectedMember?.name} will feel your support
        </p>
      </div>
    )
  }

  if (step === "custom") {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setStep("message")}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-foreground">Custom message</span>
        </div>

        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
            {selectedMember?.avatar}
          </div>
          <span className="text-sm text-muted-foreground">To {selectedMember?.name}</span>
        </div>

        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Write something meaningful..."
          className="w-full h-28 p-4 rounded-2xl bg-muted border-0 resize-none text-foreground placeholder:text-muted-foreground focus:outline-none text-sm mb-5"
          autoFocus
        />

        <button
          onClick={handleSend}
          disabled={!customMessage.trim()}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-medium text-sm transition-all",
            customMessage.trim()
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    )
  }

  if (step === "message") {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          {!member && (
            <button
              onClick={() => setStep("recipient")}
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <span className="text-sm font-medium text-foreground">Choose a message</span>
        </div>

        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
            {selectedMember?.avatar}
          </div>
          <span className="text-sm text-muted-foreground">To {selectedMember?.name}</span>
        </div>

        <div className="space-y-2 mb-5">
          {appreciationMessages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => handleSelectMessage(msg)}
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-xl transition-all text-left",
                selectedMessage?.id === msg.id
                  ? "bg-secondary ring-1 ring-primary/30"
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              <span className="text-lg">{msg.icon}</span>
              <span className="flex-1 text-sm text-foreground">{msg.text}</span>
              {selectedMessage?.id === msg.id && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setStep("custom")}
          className="text-sm text-primary font-medium mb-5 text-left"
        >
          Write custom message
        </button>

        <button
          onClick={handleSend}
          disabled={!selectedMessage}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-medium text-sm transition-all",
            selectedMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    )
  }

  // Recipient selection
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold text-foreground mb-1">Send support</h2>
      <p className="text-sm text-muted-foreground mb-5">
        Who would you like to reach?
      </p>

      <div className="space-y-2">
        {sporeMembers.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelectMember(m)}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-muted/50 hover:bg-muted transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
              {m.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.lastSeen}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
