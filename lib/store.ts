// Spores App State Store
// This simulates app state for the UI demo

export interface Member {
  id: string
  name: string
  avatar: string
  status: "thriving" | "okay" | "needs-support" | "unknown"
  lastSeen: string
  supportPreferences: string[]
  mood?: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  icon: string
  category: "wellness" | "social" | "mindfulness" | "activity"
  duration: string
  participants: string[]
  completedBy: string[]
  createdBy: string
  createdAt: string
  endsAt: string
}

export interface CheckIn {
  date: string
  mood: number
  energy: number
  stress: number
  sleep: number
  socialBattery: number
  note?: string
}

export interface Spore {
  id: string
  name: string
  members: Member[]
  health: number
  challenges: Challenge[]
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  type: "appreciation" | "observation" | "challenge-complete" | "check-in"
  memberId: string
  memberName: string
  content: string
  timestamp: string
}

// Demo data
export const currentUser: Member = {
  id: "user-1",
  name: "You",
  avatar: "🌱",
  status: "okay",
  lastSeen: "now",
  supportPreferences: ["gentle reminders", "check-in messages", "quality time"],
  mood: 7,
}

export const sporeMembers: Member[] = [
  {
    id: "member-1",
    name: "Maya",
    avatar: "🌸",
    status: "thriving",
    lastSeen: "2 hours ago",
    supportPreferences: ["words of affirmation", "active listening"],
    mood: 8,
  },
  {
    id: "member-2",
    name: "Jordan",
    avatar: "🌿",
    status: "needs-support",
    lastSeen: "1 day ago",
    supportPreferences: ["space", "practical help"],
    mood: 4,
  },
  {
    id: "member-3",
    name: "Sam",
    avatar: "🍃",
    status: "okay",
    lastSeen: "5 hours ago",
    supportPreferences: ["check-ins", "shared activities"],
    mood: 6,
  },
]

export const activeChallenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Morning walk",
    description: "Take a 10-minute walk outside each morning",
    icon: "🚶",
    category: "activity",
    duration: "7 days",
    participants: ["user-1", "member-1", "member-3"],
    completedBy: ["member-1"],
    createdBy: "member-1",
    createdAt: "2024-01-15",
    endsAt: "2024-01-22",
  },
  {
    id: "challenge-2",
    title: "Gratitude moment",
    description: "Share one thing you're grateful for today",
    icon: "🙏",
    category: "mindfulness",
    duration: "3 days",
    participants: ["user-1", "member-1", "member-2", "member-3"],
    completedBy: ["user-1", "member-1"],
    createdBy: "user-1",
    createdAt: "2024-01-16",
    endsAt: "2024-01-19",
  },
  {
    id: "challenge-3",
    title: "Reach out",
    description: "Call or message a family member",
    icon: "💬",
    category: "social",
    duration: "5 days",
    participants: ["user-1", "member-2"],
    completedBy: [],
    createdBy: "member-2",
    createdAt: "2024-01-17",
    endsAt: "2024-01-22",
  },
]

export const recentActivity: Activity[] = [
  {
    id: "activity-1",
    type: "appreciation",
    memberId: "member-1",
    memberName: "Maya",
    content: "sent you a care token",
    timestamp: "2 hours ago",
  },
  {
    id: "activity-2",
    type: "challenge-complete",
    memberId: "member-1",
    memberName: "Maya",
    content: "completed Morning walk",
    timestamp: "5 hours ago",
  },
  {
    id: "activity-3",
    type: "check-in",
    memberId: "member-3",
    memberName: "Sam",
    content: "checked in feeling calm",
    timestamp: "1 day ago",
  },
]

export const currentSpore: Spore = {
  id: "spore-1",
  name: "Inner Circle",
  members: [currentUser, ...sporeMembers],
  health: 72,
  challenges: activeChallenges,
  recentActivity,
}

export const recentCheckIns: CheckIn[] = [
  { date: "Today", mood: 7, energy: 6, stress: 4, sleep: 7, socialBattery: 5 },
  { date: "Yesterday", mood: 6, energy: 5, stress: 5, sleep: 6, socialBattery: 6 },
  { date: "2 days ago", mood: 8, energy: 7, stress: 3, sleep: 8, socialBattery: 7 },
]

// Appreciation messages
export const appreciationMessages = [
  { id: 1, text: "Thinking of you", icon: "💭" },
  { id: 2, text: "You've got this", icon: "💪" },
  { id: 3, text: "Here if you need me", icon: "🤝" },
  { id: 4, text: "Grateful for you", icon: "🙏" },
  { id: 5, text: "Sending warmth", icon: "☀️" },
  { id: 6, text: "You matter", icon: "💚" },
]

// Observation options
export const observationOptions = [
  { id: 1, label: "Seems quieter than usual", severity: "mild" },
  { id: 2, label: "Appears stressed", severity: "moderate" },
  { id: 3, label: "Seems withdrawn", severity: "moderate" },
  { id: 4, label: "Avoiding plans", severity: "mild" },
  { id: 5, label: "Low energy", severity: "mild" },
  { id: 6, label: "Seems okay", severity: "positive" },
  { id: 7, label: "Improving", severity: "positive" },
]

// Challenge templates
export const challengeTemplates = [
  { id: 1, title: "Morning walk", icon: "🚶", category: "activity" as const },
  { id: 2, title: "Drink more water", icon: "💧", category: "wellness" as const },
  { id: 3, title: "Reach out to family", icon: "💬", category: "social" as const },
  { id: 4, title: "Study together", icon: "📚", category: "social" as const },
  { id: 5, title: "Go outside", icon: "🌳", category: "activity" as const },
  { id: 6, title: "Gratitude practice", icon: "🙏", category: "mindfulness" as const },
  { id: 7, title: "Sleep on time", icon: "😴", category: "wellness" as const },
  { id: 8, title: "Shared meal", icon: "🍽️", category: "social" as const },
  { id: 9, title: "Breathing exercise", icon: "🌬️", category: "mindfulness" as const },
  { id: 10, title: "Digital detox hour", icon: "📵", category: "wellness" as const },
]
