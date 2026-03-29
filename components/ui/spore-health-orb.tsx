"use client"

import { cn } from "@/lib/utils"

interface SporeHealthOrbProps {
  health: number
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function SporeHealthOrb({ 
  health, 
  size = "md", 
  className 
}: SporeHealthOrbProps) {
  // Subtle health-based opacity rather than harsh color changes
  const opacity = Math.max(0.4, health / 100)
  
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  }

  return (
    <div className={cn("relative", className)}>
      {/* Soft outer glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-primary/20 blur-lg",
          sizeClasses[size]
        )}
        style={{ opacity: opacity * 0.5 }}
      />
      
      {/* Main orb - clean gradient */}
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center",
          sizeClasses[size]
        )}
        style={{
          background: `linear-gradient(145deg, 
            oklch(0.72 0.08 148 / ${opacity}) 0%, 
            oklch(0.55 0.10 145 / ${opacity}) 50%,
            oklch(0.48 0.09 148 / ${opacity}) 100%
          )`,
        }}
      >
        {/* Inner light core */}
        <div
          className={cn(
            "rounded-full bg-white/25",
            size === "sm" ? "w-4 h-4" :
            size === "md" ? "w-6 h-6" :
            size === "lg" ? "w-9 h-9" : "w-12 h-12"
          )}
        />
        
        {/* Subtle highlight */}
        <div
          className={cn(
            "absolute rounded-full bg-white/35",
            size === "sm" ? "w-2 h-2 top-1.5 left-1.5" :
            size === "md" ? "w-2.5 h-2.5 top-2 left-2" :
            size === "lg" ? "w-3 h-3 top-3 left-3" : "w-4 h-4 top-4 left-4"
          )}
        />
      </div>
    </div>
  )
}
