"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Leaf, Wind, Heart, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const reflectionPrompts = [
  { icon: Leaf, text: "What&apos;s on my mind" },
  { icon: Wind, text: "I need to process" },
  { icon: Heart, text: "Share gratitude" },
  { icon: Sun, text: "Guide my breathing" },
]

const assistantResponses = [
  "I hear you. Take your time - there&apos;s no rush here.",
  "Thank you for sharing that. How does it feel to put it into words?",
  "That sounds meaningful. What else comes up when you sit with that thought?",
  "I&apos;m here with you. What would feel most supportive right now?",
  "You&apos;re showing real awareness. What does your heart need in this moment?",
]

export function AIScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello. I&apos;m here when you need a quiet moment to reflect. What would you like to explore?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (text: string = input) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = assistantResponses[Math.floor(Math.random() * assistantResponses.length)]
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header - Ultra minimal */}
      <header className="px-5 pt-16 pb-4">
        <h1 className="text-[1.75rem] font-semibold text-foreground leading-tight">
          Listener
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          A quiet space to reflect
        </p>
      </header>

      {/* Disclaimer - Subtle */}
      <div className="px-5 pb-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          A supportive companion, not a therapist. For crisis support, visit Safety.
        </p>
      </div>

      {/* Messages - Clean bubbles */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-end gap-3">
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Leaf className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="bg-card rounded-2xl rounded-bl-md px-4 py-3 border border-border/50">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts - When empty */}
      {messages.length === 1 && (
        <div className="px-5 pb-4">
          <div className="flex flex-wrap gap-2">
            {reflectionPrompts.map((prompt, index) => {
              const Icon = prompt.icon
              return (
                <button
                  key={index}
                  onClick={() => handleSend(prompt.text.replace("&apos;", "'"))}
                  className="flex items-center gap-2 px-4 py-2.5 bg-card rounded-full border border-border text-sm font-medium text-foreground"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span>{prompt.text.replace("&apos;", "'")}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Input - Refined minimal */}
      <div className="px-5 pb-6 pt-2">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Share what&apos;s on your mind..."
            className="flex-1 px-4 py-3.5 rounded-2xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0",
              input.trim()
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface MessageBubbleProps {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-end gap-3", isUser && "flex-row-reverse")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <Leaf className="w-3.5 h-3.5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[75%] px-4 py-3 rounded-2xl",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border border-border/50 text-foreground rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed">{message.content.replace(/&apos;/g, "'")}</p>
      </div>
    </div>
  )
}
