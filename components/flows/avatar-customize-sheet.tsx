"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/store"

interface AvatarCustomizeSheetProps {
  onClose: () => void
}

const avatarOptions = [
  "🌱", "🌿", "🍃", "🌸", "🌺", "🌻", 
  "🌲", "🌳", "🌴", "🍀", "🌾", "🌵",
]

const evolutionStages = [
  { level: 1, name: "Seedling" },
  { level: 2, name: "Sprout" },
  { level: 3, name: "Sapling" },
  { level: 4, name: "Flourishing" },
  { level: 5, name: "Full Bloom" },
]

export function AvatarCustomizeSheet({ onClose }: AvatarCustomizeSheetProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar)
  const [currentEvolution] = useState(3)

  return (
    <div className="flex flex-col">
      {/* Avatar Display - Clean centered */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-4xl mb-3">
          {selectedAvatar}
        </div>
        <p className="text-sm font-medium text-foreground">
          {evolutionStages[currentEvolution - 1].name}
        </p>
      </div>

      {/* Evolution Progress - Minimal dots */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Growth level
        </p>
        <div className="flex items-center justify-center gap-2">
          {evolutionStages.map((stage, index) => (
            <div
              key={stage.level}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                index < currentEvolution ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Check in and support others to grow
        </p>
      </div>

      {/* Avatar Selection - Grid */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Choose avatar
        </p>
        <div className="grid grid-cols-6 gap-2">
          {avatarOptions.map((avatar) => (
            <button
              key={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              className={cn(
                "aspect-square rounded-xl flex items-center justify-center text-xl transition-all",
                selectedAvatar === avatar
                  ? "bg-secondary ring-2 ring-primary"
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      {/* Stats - Minimal row */}
      <div className="flex justify-between p-4 rounded-xl bg-muted/50 mb-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">42</p>
          <p className="text-xs text-muted-foreground">Check-ins</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">18</p>
          <p className="text-xs text-muted-foreground">Challenges</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">27</p>
          <p className="text-xs text-muted-foreground">Support sent</p>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={onClose}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-sm"
      >
        <Check className="w-4 h-4" />
        Save
      </button>
    </div>
  )
}
