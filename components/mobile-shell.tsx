"use client"

import { useState, createContext, useContext, type ReactNode } from "react"
import { Home, Users, Sparkles, User, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Screen = "home" | "spore" | "challenges" | "ai" | "profile"

interface NavigationContextType {
  currentScreen: Screen
  setCurrentScreen: (screen: Screen) => void
  showBottomSheet: boolean
  setShowBottomSheet: (show: boolean) => void
  bottomSheetContent: ReactNode | null
  setBottomSheetContent: (content: ReactNode | null) => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation must be used within MobileShell")
  }
  return context
}

interface MobileShellProps {
  children: ReactNode
}

export function MobileShell({ children }: MobileShellProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [bottomSheetContent, setBottomSheetContent] = useState<ReactNode | null>(null)

  return (
    <NavigationContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        showBottomSheet,
        setShowBottomSheet,
        bottomSheetContent,
        setBottomSheetContent,
      }}
    >
      <div className="relative h-screen w-full max-w-md mx-auto bg-background overflow-hidden">
        {/* Main content area */}
        <main className="h-full pb-24 overflow-y-auto">
          {children}
        </main>

        {/* Bottom Navigation - refined minimal tab bar */}
        <BottomNav
          currentScreen={currentScreen}
          onScreenChange={setCurrentScreen}
        />

        {/* Bottom Sheet Overlay */}
        {showBottomSheet && (
          <div
            className="absolute inset-0 bg-foreground/10 backdrop-blur-sm z-40"
            onClick={() => setShowBottomSheet(false)}
          />
        )}

        {/* Bottom Sheet */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-card rounded-t-[2rem] z-50 transition-transform duration-300 ease-out",
            showBottomSheet ? "translate-y-0" : "translate-y-full"
          )}
          style={{ boxShadow: showBottomSheet ? "0 -8px 40px rgba(0,0,0,0.08)" : "none" }}
        >
          <div className="flex justify-center pt-4 pb-3">
            <div className="w-8 h-1 bg-muted-foreground/20 rounded-full" />
          </div>
          <div className="px-6 pb-10 max-h-[75vh] overflow-y-auto">
            {bottomSheetContent}
          </div>
        </div>
      </div>
    </NavigationContext.Provider>
  )
}

interface BottomNavProps {
  currentScreen: Screen
  onScreenChange: (screen: Screen) => void
}

function BottomNav({ currentScreen, onScreenChange }: BottomNavProps) {
  const navItems: { id: Screen; icon: typeof Home; label: string }[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "spore", icon: Users, label: "Spore" },
    { id: "challenges", icon: Sparkles, label: "Grow" },
    { id: "ai", icon: MessageCircle, label: "Listen" },
    { id: "profile", icon: User, label: "You" },
  ]

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-24 bg-card/80 backdrop-blur-xl border-t border-border/30">
      <div className="flex items-center justify-around h-20 px-4">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 w-16 py-2 rounded-2xl transition-all duration-200"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                  isActive ? "bg-secondary" : "bg-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "w-[22px] h-[22px] transition-all duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
