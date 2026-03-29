import type {
  AIMessage,
  ActivityFeedItem,
  AppreciationInput,
  CareAgentContext,
  ChallengeSummary,
  CheckInInput,
  CheckInRecord,
  ConcernBand,
  DemoNotificationInput,
  HomeSummary,
  InviteSummary,
  MemberCareSnapshot,
  NotificationLog,
  OnboardingDraft,
  PassiveSignalEvent,
  PassiveSignalProviderStatus,
  PassiveTrend,
  SporeDetail,
  SporeHealthSnapshot,
  SporeMember,
  SporeMessage,
  SporeSummary,
  UserProfile,
} from "@/src/types/domain"

const nowIso = () => new Date().toISOString()

const passiveTrends: PassiveTrend[] = [
  {
    key: "location",
    label: "Movement rhythm",
    summary: "More time at familiar places this week",
    delta: "Steady",
    status: "healthy",
  },
  {
    key: "steps",
    label: "Daily steps",
    summary: "7,420 average steps over 7 days",
    delta: "+12%",
    status: "healthy",
  },
  {
    key: "screenTime",
    label: "Screen time",
    summary: "Waiting on iOS entitlement before live sync",
    delta: "Scaffolded",
    status: "disabled",
  },
]

const providerStatuses: PassiveSignalProviderStatus[] = [
  {
    key: "location",
    label: "Location trends",
    enabled: true,
    available: true,
    lastSyncedAt: nowIso(),
    metricValue: 3,
  },
  {
    key: "steps",
    label: "Steps and activity",
    enabled: true,
    available: true,
    lastSyncedAt: nowIso(),
    metricValue: 7420,
  },
  {
    key: "screenTime",
    label: "Screen time",
    enabled: false,
    available: false,
    reason: "Native entitlement required for production screen-time data.",
    metricValue: 0,
  },
  {
    key: "spending",
    label: "Spending habits",
    enabled: false,
    available: false,
    reason: "Bank sync provider not connected yet.",
    metricValue: 0,
  },
]

const membersBySpore: Record<string, SporeMember[]> = {
  "spore-1": [
    {
      id: "user-1",
      displayName: "You",
      avatar: "🌱",
      status: "okay",
      lastSeenLabel: "now",
      supportPreferences: ["gentle reminders", "check-in messages", "quiet support"],
      mood: 7,
      concernBand: "steady",
    },
    {
      id: "member-1",
      displayName: "Maya",
      avatar: "🌸",
      status: "thriving",
      lastSeenLabel: "2 hours ago",
      supportPreferences: ["words of affirmation", "active listening"],
      mood: 8,
      concernBand: "steady",
    },
    {
      id: "member-2",
      displayName: "Jordan",
      avatar: "🌿",
      status: "needs-support",
      lastSeenLabel: "1 day ago",
      supportPreferences: ["space", "practical help"],
      mood: 4,
      concernBand: "elevated",
    },
    {
      id: "member-3",
      displayName: "Sam",
      avatar: "🍃",
      status: "okay",
      lastSeenLabel: "5 hours ago",
      supportPreferences: ["shared activities", "check-ins"],
      mood: 6,
      concernBand: "watch",
    },
  ],
  "spore-2": [
    {
      id: "user-1",
      displayName: "You",
      avatar: "🌱",
      status: "okay",
      lastSeenLabel: "now",
      supportPreferences: ["gentle reminders", "check-in messages", "quiet support"],
      mood: 7,
      concernBand: "steady",
    },
    {
      id: "member-4",
      displayName: "Noa",
      avatar: "🌞",
      status: "thriving",
      lastSeenLabel: "today",
      supportPreferences: ["voice notes", "humor"],
      mood: 8,
      concernBand: "steady",
    },
    {
      id: "member-5",
      displayName: "Eli",
      avatar: "🪴",
      status: "okay",
      lastSeenLabel: "yesterday",
      supportPreferences: ["practical help", "walks"],
      mood: 6,
      concernBand: "steady",
    },
  ],
}

let spores: SporeSummary[] = [
  {
    id: "spore-1",
    name: "Inner Circle",
    description: "Your closest support space",
    memberCount: 4,
    challengeCount: 3,
    health: 72,
    memberAvatars: ["🌱", "🌸", "🌿", "🍃"],
  },
  {
    id: "spore-2",
    name: "Room to Breathe",
    description: "A softer space for slower rhythms",
    memberCount: 3,
    challengeCount: 2,
    health: 84,
    memberAvatars: ["🌱", "🌞", "🪴"],
  },
]

let profile: UserProfile = {
  id: "user-1",
  email: "hello@spores.app",
  displayName: "Aayush",
  avatar: "🌱",
  onboardingCompleted: false,
  supportPhone: "",
  activeSporeId: "spore-1",
  supportPreferences: ["gentle reminders", "check-in messages", "quiet support"],
  consent: {
    locationSignals: true,
    screenTimeSignals: false,
    spendingSignals: false,
    aiMemory: true,
    supportSharing: true,
    crisisSupport: true,
  },
  notifications: {
    dailyCheckIn: true,
    careAlerts: true,
    challengeUpdates: true,
    aiFollowUps: true,
    pushEnabled: false,
  },
}

let checkIns: CheckInRecord[] = [
  {
    id: "checkin-1",
    memberId: "user-1",
    mood: 7,
    energy: 6,
    stress: 4,
    sleep: 7,
    socialBattery: 5,
    note: "A little stretched, but grounded.",
    createdAt: nowIso(),
    timestampLabel: "Today",
  },
]

let activities: ActivityFeedItem[] = [
  {
    id: "activity-1",
    sporeId: "spore-1",
    type: "appreciation",
    memberId: "member-1",
    memberName: "Maya",
    content: "sent you a care token",
    timestampLabel: "2 hours ago",
    createdAt: nowIso(),
  },
  {
    id: "activity-2",
    sporeId: "spore-1",
    type: "challenge-complete",
    memberId: "member-1",
    memberName: "Maya",
    content: "completed Morning walk",
    timestampLabel: "5 hours ago",
    createdAt: nowIso(),
  },
  {
    id: "activity-3",
    sporeId: "spore-1",
    type: "check-in",
    memberId: "member-3",
    memberName: "Sam",
    content: "checked in feeling calmer today",
    timestampLabel: "1 day ago",
    createdAt: nowIso(),
  },
]

let challenges: ChallengeSummary[] = [
  {
    id: "challenge-1",
    sporeId: "spore-1",
    title: "Morning walk",
    description: "Take a 10-minute walk outside each morning",
    icon: "🚶",
    category: "activity",
    durationLabel: "7 days",
    participantIds: ["user-1", "member-1", "member-3"],
    completedByIds: ["member-1"],
    createdBy: "member-1",
    createdAt: "2026-03-20T10:00:00.000Z",
    endsAt: "2026-03-27T10:00:00.000Z",
  },
  {
    id: "challenge-2",
    sporeId: "spore-1",
    title: "Gratitude moment",
    description: "Share one thing you're grateful for today",
    icon: "🙏",
    category: "mindfulness",
    durationLabel: "3 days",
    participantIds: ["user-1", "member-1", "member-2", "member-3"],
    completedByIds: ["user-1", "member-1"],
    createdBy: "user-1",
    createdAt: "2026-03-23T10:00:00.000Z",
    endsAt: "2026-03-26T10:00:00.000Z",
  },
  {
    id: "challenge-3",
    sporeId: "spore-1",
    title: "Reach out",
    description: "Call or message someone in your family",
    icon: "💬",
    category: "social",
    durationLabel: "5 days",
    participantIds: ["user-1", "member-2"],
    completedByIds: [],
    createdBy: "member-2",
    createdAt: "2026-03-24T10:00:00.000Z",
    endsAt: "2026-03-29T10:00:00.000Z",
  },
  {
    id: "challenge-4",
    sporeId: "spore-2",
    title: "Shared meal",
    description: "Eat one slow meal together this week",
    icon: "🍽️",
    category: "social",
    durationLabel: "7 days",
    participantIds: ["user-1", "member-4", "member-5"],
    completedByIds: ["member-4"],
    createdBy: "member-4",
    createdAt: "2026-03-22T10:00:00.000Z",
    endsAt: "2026-03-29T10:00:00.000Z",
  },
]

let notifications: NotificationLog[] = [
  {
    id: "notification-1",
    title: "Care pulse updated",
    body: "Jordan may need a softer check-in today.",
    createdAt: nowIso(),
    kind: "server",
    metadata: { source: "demo-seed", sporeId: "spore-1" },
  },
  {
    id: "notification-2",
    title: "Challenge reminder",
    body: "Morning walk is still open for today.",
    createdAt: nowIso(),
    kind: "local",
    metadata: { source: "demo-seed", sporeId: "spore-1" },
  },
]

let aiMessages: AIMessage[] = [
  {
    id: "ai-1",
    role: "assistant",
    content: "Hello. I’m here when you need a quiet moment to reflect. What would you like to explore?",
    createdAt: nowIso(),
  },
]

let passiveEvents: PassiveSignalEvent[] = [
  {
    id: "signal-1",
    key: "location",
    metricName: "location_consistency",
    metricValue: 0.78,
    capturedAt: nowIso(),
    summary: "Consistent movement around familiar places.",
  },
  {
    id: "signal-2",
    key: "steps",
    metricName: "daily_steps",
    metricValue: 7420,
    capturedAt: nowIso(),
    summary: "Healthy average activity this week.",
  },
]

let invitesBySpore: Record<string, InviteSummary[]> = {
  "spore-1": [
    {
      id: "invite-1",
      sporeId: "spore-1",
      inviteCode: "BLOOM42",
      email: "newfriend@example.com",
      invitedBy: "user-1",
      createdAt: nowIso(),
      status: "pending",
    },
  ],
  "spore-2": [],
}

let sporeMessages: SporeMessage[] = [
  {
    id: "spore-message-1",
    sporeId: "spore-1",
    messageType: "system",
    body: "Maya started Morning walk. A small rhythm can carry the whole Spore.",
    createdAt: nowIso(),
    metadata: { source: "challenge-created", challengeId: "challenge-1" },
  },
  {
    id: "spore-message-2",
    sporeId: "spore-1",
    messageType: "user",
    body: "I can do mornings this week. Anyone want to join tomorrow?",
    createdAt: nowIso(),
    authorId: "member-1",
    authorName: "Maya",
    authorAvatar: "🌸",
  },
]

function getSporeHealth(sporeId: string): SporeHealthSnapshot {
  const summary = spores.find((item) => item.id === sporeId)
  const score = summary?.health ?? 70
  return {
    sporeId,
    score,
    baseline: Math.max(55, score - 12),
    activityBonus: 12,
    feedbackPenalty: score < 70 ? 4 : 0,
    updatedAt: nowIso(),
    summary: score >= 75 ? "Your Spore has a warm, steady rhythm." : "Your Spore is holding together with room for more care.",
  }
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function currentUserFirstName() {
  return profile.displayName.trim().split(/\s+/)[0] || "friend"
}

function findMember(sporeId: string, memberId: string) {
  return (membersBySpore[sporeId] ?? []).find((item) => item.id === memberId)
}

function currentUserIsFriendRecipient(targetMemberId: string, audience: DemoNotificationInput["audience"]) {
  return profile.id !== targetMemberId && (audience === "friends" || audience === "both")
}

function currentUserIsSelfRecipient(targetMemberId: string, audience: DemoNotificationInput["audience"]) {
  return profile.id === targetMemberId && (audience === "self" || audience === "both")
}

function pushNotification(entry: NotificationLog) {
  notifications = [entry, ...notifications]
}

export const demoData = {
  async bootstrapProfile() {
    return profile
  },
  async signIn(email: string) {
    profile = { ...profile, email }
    return profile
  },
  async signUp(email: string, displayName: string) {
    profile = { ...profile, email, displayName }
    return { profile, needsConfirmation: false }
  },
  async signOut() {
    return true
  },
  async submitOnboarding(draft: OnboardingDraft) {
    const nextSporeId = draft.mode === "create" ? `spore-${spores.length + 1}` : "spore-1"
    if (draft.mode === "create") {
      spores = [
        ...spores,
        {
          id: nextSporeId,
          name: draft.sporeName || "New Spore",
          description: "A newly created support circle",
          memberCount: 1,
          challengeCount: 0,
          health: 68,
          memberAvatars: [draft.avatar || "🌱"],
        },
      ]
      membersBySpore[nextSporeId] = [
        {
          id: "user-1",
          displayName: draft.displayName || profile.displayName,
          avatar: draft.avatar || "🌱",
          status: "okay",
          lastSeenLabel: "now",
          supportPreferences: draft.supportStyle.length ? draft.supportStyle : profile.supportPreferences,
          mood: 7,
          concernBand: "steady",
        },
      ]
    }

    profile = {
      ...profile,
      displayName: draft.displayName || profile.displayName,
      avatar: draft.avatar || profile.avatar,
      supportPreferences: draft.supportStyle.length ? draft.supportStyle : profile.supportPreferences,
      onboardingCompleted: true,
      activeSporeId: nextSporeId,
    }

    return profile
  },
  async getUserSpores() {
    return spores
  },
  async getHomeSummary(sporeId?: string): Promise<HomeSummary> {
    const active = spores.find((item) => item.id === (sporeId ?? profile.activeSporeId)) ?? spores[0]
    return {
      greeting: `${getGreeting()}, ${currentUserFirstName()}`,
      careScore: active.health,
      currentSpore: active,
      passiveTrends,
      recentActivity: activities.filter((item) => item.sporeId === active.id).slice(0, 4),
      activeChallenges: challenges.filter((item) => item.sporeId === active.id).slice(0, 3),
      latestCheckIn: checkIns[0],
    }
  },
  async getSporeDetail(sporeId: string): Promise<SporeDetail> {
    const summary = spores.find((item) => item.id === sporeId) ?? spores[0]
    return {
      summary,
      health: getSporeHealth(sporeId),
      members: membersBySpore[sporeId] ?? [],
      activities: activities.filter((item) => item.sporeId === sporeId),
      challenges: challenges.filter((item) => item.sporeId === sporeId),
    }
  },
  async getMemberSnapshot(sporeId: string, memberId: string): Promise<MemberCareSnapshot> {
    const member = (membersBySpore[sporeId] ?? []).find((item) => item.id === memberId) ?? membersBySpore[sporeId]?.[0]
    return {
      member: member!,
      supportCount: activities.filter((item) => item.sporeId === sporeId && item.memberId === memberId).length,
      lastCheckInLabel: memberId === "user-1" ? "Today" : "Yesterday",
      activeChallenges: challenges.filter((item) => item.sporeId === sporeId && item.participantIds.includes(memberId)).length,
      feedbackHistory: activities.filter((item) => item.sporeId === sporeId).slice(0, 4),
    }
  },
  async setActiveSpore(sporeId: string) {
    profile = { ...profile, activeSporeId: sporeId }
    return profile
  },
  async createCheckIn(sporeId: string, input: CheckInInput) {
    const record: CheckInRecord = {
      id: `checkin-${checkIns.length + 1}`,
      memberId: "user-1",
      createdAt: nowIso(),
      timestampLabel: "Just now",
      ...input,
    }
    checkIns = [record, ...checkIns]
    activities = [
      {
        id: `activity-${activities.length + 1}`,
        sporeId,
        type: "check-in",
        memberId: "user-1",
        memberName: "You",
        content: "checked in with quiet honesty",
        timestampLabel: "Just now",
        createdAt: nowIso(),
      },
      ...activities,
    ]
    return record
  },
  async submitObservation(sporeId: string, input: {
    memberId: string
    label: string
    severity: "mild" | "moderate" | "positive"
    note?: string
  }) {
    const member = (membersBySpore[sporeId] ?? []).find((item) => item.id === input.memberId)
    activities = [
      {
        id: `activity-${activities.length + 1}`,
        sporeId,
        type: "observation",
        memberId: input.memberId,
        memberName: member?.displayName ?? "Member",
        content: input.note || input.label,
        timestampLabel: "Just now",
        createdAt: nowIso(),
      },
      ...activities,
    ]
    notifications = [
      {
        id: `notification-${notifications.length + 1}`,
        title: "Observation logged",
        body: `${member?.displayName ?? "A member"} may need a gentler check-in.`,
        createdAt: nowIso(),
        kind: "server",
        metadata: { source: "observation", sporeId, memberId: input.memberId },
      },
      ...notifications,
    ]
    return true
  },
  async sendAppreciation(sporeId: string, input: AppreciationInput) {
    const member = (membersBySpore[sporeId] ?? []).find((item) => item.id === input.memberId)
    activities = [
      {
        id: `activity-${activities.length + 1}`,
        sporeId,
        type: "appreciation",
        memberId: input.memberId,
        memberName: member?.displayName ?? "Member",
        content: input.message,
        timestampLabel: "Just now",
        createdAt: nowIso(),
      },
      ...activities,
    ]
    return true
  },
  async createChallenge(sporeId: string, challenge: Pick<ChallengeSummary, "title" | "description" | "icon" | "category" | "durationLabel"> & { participantIds: string[] }) {
    const next: ChallengeSummary = {
      id: `challenge-${challenges.length + 1}`,
      sporeId,
      title: challenge.title,
      description: challenge.description,
      icon: challenge.icon,
      category: challenge.category,
      durationLabel: challenge.durationLabel,
      participantIds: ["user-1", ...challenge.participantIds],
      completedByIds: [],
      createdBy: "user-1",
      createdAt: nowIso(),
      endsAt: nowIso(),
    }
    challenges = [next, ...challenges]
    sporeMessages = [
      {
        id: `spore-message-${sporeMessages.length + 1}`,
        sporeId,
        messageType: "system",
        body: `${currentUserFirstName()} started ${challenge.title}. Join in if it feels supportive.`,
        createdAt: nowIso(),
        metadata: { source: "challenge-created", challengeId: next.id },
      },
      ...sporeMessages,
    ]
    spores = spores.map((item) =>
      item.id === sporeId ? { ...item, challengeCount: item.challengeCount + 1 } : item
    )
    pushNotification({
      id: `notification-${notifications.length + 1}`,
      title: "Challenge started",
      body: `${challenge.title} was shared with your Spore.`,
      createdAt: nowIso(),
      kind: "server",
      metadata: { source: "challenge-created", sporeId, challengeId: next.id },
    })
    return next
  },
  async completeChallenge(sporeId: string, challengeId: string) {
    challenges = challenges.map((item) =>
      item.id === challengeId && !item.completedByIds.includes("user-1")
        ? { ...item, completedByIds: [...item.completedByIds, "user-1"] }
        : item
    )
    spores = spores.map((item) =>
      item.id === sporeId ? { ...item, health: Math.min(100, item.health + 5) } : item
    )
    return true
  },
  async joinChallenge(challengeId: string) {
    challenges = challenges.map((item) =>
      item.id === challengeId && !item.participantIds.includes("user-1")
        ? { ...item, participantIds: [...item.participantIds, "user-1"] }
        : item
    )
    return true
  },
  async getAIConversation() {
    return aiMessages
  },
  async sendAIMessage(content: string) {
    const userMessage: AIMessage = {
      id: `ai-${aiMessages.length + 1}`,
      role: "user",
      content,
      createdAt: nowIso(),
    }
    const concernBand: ConcernBand =
      /hopeless|can.t do this|panic|alone/i.test(content) ? "elevated" : /overwhelmed|stuck/i.test(content) ? "watch" : "steady"
    const normalized = content.toLowerCase()
    const reply =
      concernBand === "elevated"
        ? "I’m hearing a much heavier moment in that. Please pause, take one slower breath, and open Safety or reach out to someone in your Spore right now if you need immediate support."
        : concernBand === "watch"
        ? normalized.includes("overwhelmed")
          ? "That sounds overwhelming. Let’s make this smaller: what is the next ten-minute step that would help you feel a little less pinned down?"
          : "It makes sense that this feels stuck right now. Would it help to name whether you need rest, reassurance, or one practical action from someone in your Spore?"
        : normalized.includes("gratitude")
        ? "That’s worth holding onto. What about that moment made you feel cared for, steady, or more like yourself?"
        : normalized.includes("breathe") || normalized.includes("breathing")
        ? "Let’s keep it simple. Inhale for four, exhale for six, and do that three times. After that, notice whether your body feels even slightly softer."
        : normalized.includes("process")
        ? "We can sort it gently. What happened, what did it bring up in you, and what do you most need now?"
        : "I’m with you. Say a little more about what feels most present right now, and we can slow it down together."
    const response: AIMessage = {
      id: `ai-${aiMessages.length + 2}`,
      role: "assistant",
      content: reply,
      createdAt: nowIso(),
      concernBand,
      citations: concernBand === "steady" ? ["memory:recent-checkin"] : ["memory:care-score", "memory:passive-trend"],
    }
    aiMessages = [...aiMessages, userMessage, response]
    if (concernBand !== "steady") {
      pushNotification({
        id: `notification-${notifications.length + 1}`,
        title: "Care signal noticed",
        body: "A gentle AI follow-up was logged for your Spore.",
        createdAt: nowIso(),
        kind: "server",
        metadata: { source: "ai-follow-up", concernBand },
      })
    }
    return {
      message: response,
      concernBand,
      citations: response.citations ?? [],
    }
  },
  async getNotifications() {
    return notifications
  },
  async registerPush(token: string) {
    profile = {
      ...profile,
      notifications: { ...profile.notifications, pushEnabled: true },
    }
    pushNotification({
      id: `notification-${notifications.length + 1}`,
      title: "Push enabled",
      body: `Expo push token registered: ${token.slice(0, 12)}...`,
      createdAt: nowIso(),
      kind: "push",
      metadata: { source: "push-registration" },
    })
    return true
  },
  async getTrackingStatus() {
    return providerStatuses
  },
  async collectSignals() {
    const fresh: PassiveSignalEvent[] = [
      {
        id: `signal-${passiveEvents.length + 1}`,
        key: "location",
        metricName: "weekly_place_stability",
        metricValue: 0.82,
        capturedAt: nowIso(),
        summary: "Passive location rhythm refreshed.",
      },
      {
        id: `signal-${passiveEvents.length + 2}`,
        key: "steps",
        metricName: "daily_steps",
        metricValue: 7612,
        capturedAt: nowIso(),
        summary: "Steps refreshed from the local adapter.",
      },
    ]
    passiveEvents = [...fresh, ...passiveEvents]
    return fresh
  },
  async setProviderEnabled(key: PassiveSignalProviderStatus["key"], enabled: boolean) {
    const next = providerStatuses.map((item) =>
      item.key === key ? { ...item, enabled } : item
    )
    next.forEach((item, index) => {
      providerStatuses[index] = item
    })
    return next
  },
  async updateProfile(partial: Partial<UserProfile>) {
    profile = { ...profile, ...partial }
    return profile
  },
  async getProfile() {
    return profile
  },
  async getSporeInvites(sporeId: string) {
    return invitesBySpore[sporeId] ?? []
  },
  async createSporeInvite(sporeId: string, email?: string) {
    const invite: InviteSummary = {
      id: `invite-${Object.values(invitesBySpore).flat().length + 1}`,
      sporeId,
      inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
      email,
      invitedBy: profile.id,
      createdAt: nowIso(),
      status: "pending",
    }
    invitesBySpore[sporeId] = [invite, ...(invitesBySpore[sporeId] ?? [])]
    return invite
  },
  async getSporeMessages(sporeId: string) {
    return sporeMessages
      .filter((item) => item.sporeId === sporeId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  },
  async sendSporeMessage(sporeId: string, body: string) {
    const message: SporeMessage = {
      id: `spore-message-${sporeMessages.length + 1}`,
      sporeId,
      messageType: "user",
      body,
      createdAt: nowIso(),
      authorId: profile.id,
      authorName: profile.displayName,
      authorAvatar: profile.avatar,
    }
    sporeMessages = [...sporeMessages, message]
    return message
  },
  async getCareAgentContext(sporeId: string, memberId: string): Promise<CareAgentContext> {
    const member = findMember(sporeId, memberId) ?? findMember(sporeId, "user-1")
    return {
      memberId,
      sporeId,
      memberName: member?.displayName ?? "Member",
      currentConcernBand: member?.concernBand ?? "steady",
      latestCheckIns: checkIns.filter((item) => item.memberId === memberId).slice(0, 3),
      recentSignals: passiveEvents.slice(0, 4),
      recentObservations: activities
        .filter((item) => item.sporeId === sporeId)
        .slice(0, 4)
        .map((item) => ({
          id: item.id,
          body: item.content,
          severity: item.type === "observation" ? "moderate" : "steady",
          createdAt: item.createdAt,
        })),
      relevantMemories: aiMessages.slice(-3).map((item) => ({
        id: item.id,
        content: item.content,
        createdAt: item.createdAt,
        sourceType: item.role,
      })),
      summary:
        member?.concernBand === "elevated"
          ? `${member?.displayName ?? "This member"} has shown a softer rhythm lately, with lower mood and support-relevant signals worth checking in on.`
          : `${member?.displayName ?? "This member"} appears close to their usual rhythm, with no strong anomaly in the demo dataset.`,
    }
  },
  async sendDemoNotification(input: DemoNotificationInput) {
    const targetMember = findMember(input.sporeId, input.targetMemberId)
    const created: NotificationLog[] = []

    if (currentUserIsSelfRecipient(input.targetMemberId, input.audience)) {
      const selfNotification: NotificationLog = {
        id: `notification-${notifications.length + created.length + 1}`,
        title: input.selfTitle,
        body: input.selfBody,
        createdAt: nowIso(),
        kind: "server",
        metadata: {
          source: "demo-trigger",
          sporeId: input.sporeId,
          targetMemberId: input.targetMemberId,
          audience: "self",
        },
      }
      created.push(selfNotification)
    }

    if (currentUserIsFriendRecipient(input.targetMemberId, input.audience) && input.friendsBody) {
      const friendNotification: NotificationLog = {
        id: `notification-${notifications.length + created.length + 1}`,
        title: input.friendsTitle ?? "Check in on your friend",
        body: input.friendsBody.replace(/\[name\]/g, targetMember?.displayName ?? "your friend"),
        createdAt: nowIso(),
        kind: "server",
        metadata: {
          source: "demo-trigger",
          sporeId: input.sporeId,
          targetMemberId: input.targetMemberId,
          audience: "friends",
        },
      }
      created.push(friendNotification)
    }

    notifications = [...created.reverse(), ...notifications]
    return created
  },
}
