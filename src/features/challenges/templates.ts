import type { ChallengeCategory } from "@/src/types/domain"

export const challengeTemplates: Array<{
  title: string
  icon: string
  category: ChallengeCategory
  description: string
}> = [
  {
    title: "Morning walk",
    icon: "🚶",
    category: "activity",
    description: "Take a short walk outside and let your body reset.",
  },
  {
    title: "Drink more water",
    icon: "💧",
    category: "wellness",
    description: "Keep each other gently accountable for hydration.",
  },
  {
    title: "Sleep reset",
    icon: "🌙",
    category: "wellness",
    description: "Aim for a calmer wind-down and a steadier bedtime.",
  },
  {
    title: "Reach out",
    icon: "💬",
    category: "social",
    description: "Send one caring message or call someone you trust.",
  },
  {
    title: "Sunlight break",
    icon: "🌤️",
    category: "activity",
    description: "Step outside for a little sun and a softer reset.",
  },
  {
    title: "Breathing",
    icon: "🌬️",
    category: "mindfulness",
    description: "Pause for a few slow breaths and name what is here.",
  },
  {
    title: "Journal check-in",
    icon: "📓",
    category: "mindfulness",
    description: "Write a few honest lines about how the day feels.",
  },
  {
    title: "Gratitude moment",
    icon: "🙏",
    category: "mindfulness",
    description: "Share one thing that felt grounding today.",
  },
  {
    title: "Study together",
    icon: "📚",
    category: "social",
    description: "Body-double with someone for focus and steady company.",
  },
  {
    title: "Meal check-in",
    icon: "🍲",
    category: "wellness",
    description: "Share a nourishing meal or check in after eating.",
  },
]

export function findChallengeTemplate(title?: string | string[]) {
  const target = Array.isArray(title) ? title[0] : title
  return challengeTemplates.find((item) => item.title === target) ?? challengeTemplates[0]
}
