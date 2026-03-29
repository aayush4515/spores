export type MemberStatus = "thriving" | "okay" | "needs-support" | "unknown"
export type ActivityType =
  | "appreciation"
  | "observation"
  | "challenge-complete"
  | "check-in"
  | "challenge-created"
  | "hangout"
export type ChallengeCategory = "wellness" | "social" | "mindfulness" | "activity"
export type ConcernBand = "steady" | "watch" | "elevated"
export type ProviderKey = "location" | "screenTime" | "steps" | "spending"
export type SporeMessageType = "user" | "system"

export interface FeatureFlags {
  multiSpore: boolean
  activities: boolean
  passiveTracking: boolean
  rag: boolean
  aiAgent: boolean
  serverNotifications: boolean
  demoMode: boolean
}

export interface NotificationPreference {
  dailyCheckIn: boolean
  careAlerts: boolean
  challengeUpdates: boolean
  aiFollowUps: boolean
  pushEnabled: boolean
}

export interface ConsentSettings {
  locationSignals: boolean
  screenTimeSignals: boolean
  spendingSignals: boolean
  aiMemory: boolean
  supportSharing: boolean
  crisisSupport: boolean
}

export interface UserProfile {
  id: string
  email: string
  displayName: string
  avatar: string
  onboardingCompleted: boolean
  supportPhone: string
  activeSporeId?: string
  supportPreferences: string[]
  consent: ConsentSettings
  notifications: NotificationPreference
}

export interface SporeMember {
  id: string
  userId?: string
  displayName: string
  avatar: string
  status: MemberStatus
  lastSeenLabel: string
  supportPreferences: string[]
  mood?: number
  concernBand?: ConcernBand
}

export interface ChallengeSummary {
  id: string
  sporeId: string
  title: string
  description: string
  icon: string
  category: ChallengeCategory
  durationLabel: string
  participantIds: string[]
  completedByIds: string[]
  createdBy: string
  createdAt: string
  endsAt: string
}

export interface ActivityFeedItem {
  id: string
  sporeId: string
  type: ActivityType
  memberId: string
  memberName: string
  content: string
  timestampLabel: string
  createdAt: string
}

export interface CheckInInput {
  mood: number
  energy: number
  stress: number
  sleep: number
  socialBattery: number
  note?: string
}

export interface CheckInRecord extends CheckInInput {
  id: string
  memberId: string
  createdAt: string
  timestampLabel: string
}

export interface ObservationInput {
  memberId: string
  label: string
  severity: "mild" | "moderate" | "positive"
  confidence: "unsure" | "somewhat" | "confident"
  note?: string
}

export interface AppreciationInput {
  memberId: string
  message: string
  icon?: string
}

export interface MemberCareSnapshot {
  member: SporeMember
  supportCount: number
  lastCheckInLabel: string
  activeChallenges: number
  feedbackHistory: ActivityFeedItem[]
}

export interface SporeHealthSnapshot {
  sporeId: string
  score: number
  baseline: number
  activityBonus: number
  feedbackPenalty: number
  updatedAt: string
  summary: string
}

export interface SporeSummary {
  id: string
  name: string
  description: string
  memberCount: number
  challengeCount: number
  health: number
  memberAvatars: string[]
}

export interface SporeDetail {
  summary: SporeSummary | null
  health: SporeHealthSnapshot | null
  members: SporeMember[]
  activities: ActivityFeedItem[]
  challenges: ChallengeSummary[]
}

export interface PassiveTrend {
  key: ProviderKey
  label: string
  summary: string
  delta: string
  status: "healthy" | "watch" | "disabled"
}

export interface PassiveSignalProviderStatus {
  key: ProviderKey
  label: string
  enabled: boolean
  available: boolean
  lastSyncedAt?: string
  reason?: string
  metricValue?: number
}

export interface PassiveSignalEvent {
  id: string
  key: ProviderKey
  metricName: string
  metricValue: number
  capturedAt: string
  summary: string
}

export interface HomeSummary {
  greeting: string
  careScore: number
  currentSpore: SporeSummary | null
  passiveTrends: PassiveTrend[]
  recentActivity: ActivityFeedItem[]
  activeChallenges: ChallengeSummary[]
  latestCheckIn?: CheckInRecord
}

export interface AIMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
  concernBand?: ConcernBand
  citations?: string[]
}

export interface AIReply {
  message: AIMessage
  concernBand: ConcernBand
  citations: string[]
}

export interface NotificationLog {
  id: string
  title: string
  body: string
  createdAt: string
  kind: "local" | "push" | "server"
  metadata?: Record<string, unknown>
}

export interface SporeMessage {
  id: string
  sporeId: string
  messageType: SporeMessageType
  body: string
  createdAt: string
  authorId?: string
  authorName?: string
  authorAvatar?: string
  metadata?: Record<string, unknown>
}

export interface InviteSummary {
  id: string
  sporeId: string
  inviteCode: string
  email?: string
  invitedBy?: string
  acceptedAt?: string
  createdAt: string
  status: "pending" | "accepted"
}

export interface DemoNotificationInput {
  sporeId: string
  targetMemberId: string
  audience: "self" | "friends" | "both"
  selfTitle: string
  selfBody: string
  friendsTitle?: string
  friendsBody?: string
}

export interface CareAgentContext {
  memberId: string
  sporeId: string
  memberName: string
  currentConcernBand: ConcernBand
  latestCheckIns: Array<{
    id: string
    mood: number
    energy: number
    stress: number
    sleep: number
    socialBattery: number
    note?: string
    createdAt: string
  }>
  recentSignals: PassiveSignalEvent[]
  recentObservations: Array<{
    id: string
    body: string
    severity?: string
    createdAt: string
  }>
  relevantMemories: Array<{
    id: string
    content: string
    createdAt: string
    sourceType?: string
  }>
  summary: string
}

export type OnboardingMode = "create" | "join"

export interface OnboardingDraft {
  mode: OnboardingMode | null
  displayName: string
  sporeName: string
  inviteCode: string
  invitedEmails: string[]
  consentAccepted: boolean
  sharingStyle: string
  supportStyle: string[]
  alertPrefs: string[]
  avatar: string
}

export interface AuthSessionState {
  status: "booting" | "signedOut" | "authenticated"
  profile: UserProfile | null
}
