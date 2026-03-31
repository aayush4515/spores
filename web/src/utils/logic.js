export function getSporeById(spores, sporeId) {
  return spores.find((spore) => spore.id === sporeId) ?? null;
}

export function getMemberById(members, memberId) {
  return members.find((member) => member.id === memberId) ?? null;
}

export function formatDaysAgoLabel(daysAgo) {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "1 day ago";
  return `${daysAgo} days ago`;
}

const SUPPORT_SEVERITY_ORDER = ["normal", "light_check", "needs_attention", "high_support"];

function bumpSupportSeverity(label) {
  const i = SUPPORT_SEVERITY_ORDER.indexOf(label);
  if (i === -1) return label;
  return SUPPORT_SEVERITY_ORDER[Math.min(i + 1, SUPPORT_SEVERITY_ORDER.length - 1)];
}

/**
 * Simulated movement / rhythm signals (on-device, privacy-safe).
 * Returns keys: very_active | active | steady | low_activity | inactive
 */
export function getActivityStatus(member) {
  const ad = member?.activityData ?? {};
  const steps = Number(ad.stepsCount ?? 0);
  const leftHome = ad.leftHomeToday === true;
  const gym = ad.visitedGym === true;
  const outside = ad.wentOutside === true;

  if (gym) {
    return {
      key: "very_active",
      label: "Very active",
      message: "Active and moving well today.",
    };
  }

  if (steps < 1000 && !leftHome) {
    return {
      key: "inactive",
      label: "Inactive",
      message: "Lower movement than usual today.",
    };
  }

  if (steps < 3000) {
    return {
      key: "low_activity",
      label: "Lower activity",
      message: "Movement is lighter than usual.",
    };
  }

  if (steps >= 5000 && outside) {
    return {
      key: "active",
      label: "Active",
      message: "Active and moving well.",
    };
  }

  return {
    key: "steady",
    label: "Steady",
    message: "Moving at an everyday pace.",
  };
}

/**
 * Simulated work/study intensity (privacy-safe, no timestamps or location).
 * Returns keys: overworking | balanced | low_engagement
 */
export function getWorkIntensity(member) {
  const wd = member?.workData;
  if (!wd) {
    return { level: "balanced", message: "No work data available." };
  }

  const hours = Number(wd.hoursWorkedToday ?? 0);
  const sessions = Number(wd.workSessionsCount ?? 0);
  const lastH = Number(wd.lastWorkActivityHoursAgo ?? 99);

  if (hours >= 10 || (hours >= 9 && lastH < 2 && sessions >= 4)) {
    return { level: "overworking", message: "Working extended hours today." };
  }
  if (hours >= 7) {
    return { level: "balanced", message: "Healthy work rhythm." };
  }
  if (hours < 3) {
    return { level: "low_engagement", message: "Low engagement with work/study." };
  }
  return { level: "balanced", message: "Healthy work rhythm." };
}

function shouldBumpSupportForWork(member) {
  const wi = getWorkIntensity(member);
  return wi.level === "overworking";
}

function shouldBumpSupportForActivity(member) {
  const ad = member?.activityData;
  if (!ad) return false;
  const status = getActivityStatus(member);
  const lastH = Number(ad.lastActiveHoursAgo ?? 0);
  return status.key === "inactive" || lastH > 20;
}

function getBaseSupportLevel(member) {
  const signalsCount = Number(member?.signalsCount ?? 0);
  const checkInStatus = member?.checkInStatus ?? "good";
  const activityTrend = member?.activityTrend ?? "normal";

  if (
    signalsCount >= 3 ||
    checkInStatus === "missing" ||
    activityTrend === "very_low"
  ) {
    return {
      label: "high_support",
      message: "Member may need immediate and direct support.",
      recommendedAction: "Reach out now and suggest a guided check-in.",
    };
  }

  if (signalsCount === 2) {
    return {
      label: "needs_attention",
      message: "Member is showing signs of strain and should be checked on soon.",
      recommendedAction: "Send a supportive message and follow up today.",
    };
  }

  if (checkInStatus === "not_great") {
    return {
      label: "needs_attention",
      message: "Latest check-in suggests additional support may help.",
      recommendedAction: "Check in and offer a calming prompt.",
    };
  }

  if (signalsCount === 1) {
    return {
      label: "light_check",
      message: "Member may benefit from a gentle nudge.",
      recommendedAction: "Send a brief encouragement check-in.",
    };
  }

  return {
    label: "normal",
    message: "Member appears stable with no active support signals.",
    recommendedAction: "Maintain normal cadence and monitor trends.",
  };
}

export function getSupportLevel(member) {
  let base = getBaseSupportLevel(member);

  if (shouldBumpSupportForActivity(member)) {
    const bumped = bumpSupportSeverity(base.label);
    if (bumped !== base.label) {
      base = {
        ...base,
        label: bumped,
        message:
          bumped === "high_support"
            ? "Rhythm and check-in signals suggest prioritizing this person."
            : base.message,
      };
    }
  }

  if (shouldBumpSupportForWork(member)) {
    const activity = getActivityStatus(member);
    const actInactive = activity.key === "inactive" || activity.key === "low_activity";
    const missed = member?.checkInStatus === "missing";
    const combined = actInactive || missed;

    const targetMin = combined ? "high_support" : "needs_attention";
    const idx = SUPPORT_SEVERITY_ORDER.indexOf(base.label);
    const targetIdx = SUPPORT_SEVERITY_ORDER.indexOf(targetMin);
    if (idx < targetIdx) {
      base = {
        ...base,
        label: targetMin,
        message: combined
          ? "Signs of overwork combined with other strain signals—worth prioritizing."
          : "Extended work hours detected—may indicate burnout risk.",
      };
    }
  }

  return base;
}

export function getSupportFeedItem(member) {
  const support = getSupportLevel(member);

  if (support.label === "normal") {
    return null;
  }

  const name = member?.name ?? "This member";
  const activity = getActivityStatus(member);
  const work = getWorkIntensity(member);
  const missed = member?.checkInStatus === "missing";
  const inactive = activity.key === "inactive";
  const overworking = work.level === "overworking";

  let message;
  if (overworking && inactive) {
    message = `${name} may be overworking and hasn't been active physically`;
  } else if (overworking && missed) {
    message = `${name} is working long hours and missed check-ins`;
  } else if (overworking) {
    message = `${name} may be overworking today`;
  } else if (inactive && missed) {
    message = `${name} has been inactive and missed check-ins`;
  } else if (inactive) {
    message = `${name} has been less active lately`;
  } else if (missed) {
    message = `${name} missed recent check-ins`;
  } else if (support.label === "high_support") {
    message = `${name} may need a thoughtful check-in soon`;
  } else if (support.label === "needs_attention") {
    message = `Consider a gentle check-in with ${name}`;
  } else {
    message = `A gentle check-in with ${name} could help`;
  }

  if (support.label === "high_support") {
    return {
      supportLabel: support.label,
      message,
      recommendedAction: "Reach out now with a direct, supportive message.",
    };
  }

  if (support.label === "needs_attention") {
    return {
      supportLabel: support.label,
      message,
      recommendedAction: "Send a supportive message and follow up today.",
    };
  }

  return {
    supportLabel: support.label,
    message,
    recommendedAction: "Send a brief encouragement note.",
  };
}

/**
 * Full prompt list for Home + Support Prompts (support items, reconnection, optional self-prompt).
 */
export function buildSupportPromptList(spores, currentUser, settings) {
  if (!settings?.supportPrompts) return [];
  const prompts = [];

  for (const spore of spores) {
    for (const member of spore.members) {
      const feedItem = getSupportFeedItem(member);
      if (feedItem) {
        prompts.push({
          id: `${spore.id}-${member.id}-support`,
          kind: "support",
          sporeName: spore.name,
          memberName: member.name,
          memberId: member.id,
          sporeId: spore.id,
          supportLabel: feedItem.supportLabel,
          message: feedItem.message,
          recommendedAction: feedItem.recommendedAction,
        });
      }

      if (settings.activityTracking) {
        const reconnect = getReconnectionPrompt(member, 3);
        if (reconnect) {
          prompts.push({
            id: `${spore.id}-${member.id}-reconnect`,
            kind: "reconnection",
            sporeName: spore.name,
            memberName: member.name,
            memberId: member.id,
            sporeId: spore.id,
            supportLabel: "reconnection",
            message: reconnect,
            recommendedAction: "Send a quick reconnection note.",
          });
        }
      }
    }
  }

  const userSupport = getSupportFeedItem(currentUser);
  if (userSupport) {
    prompts.push({
      id: "current-user-support",
      kind: "support",
      sporeName: "Personal",
      memberName: currentUser.name,
      memberId: null,
      sporeId: null,
      supportLabel: userSupport.supportLabel,
      message: userSupport.message,
      recommendedAction: userSupport.recommendedAction,
    });
  }

  return prompts;
}

export function getSupportReasons(member) {
  const reasons = [];
  const signalsCount = Number(member?.signalsCount ?? 0);
  const checkInStatus = member?.checkInStatus ?? "good";
  const activityTrend = member?.activityTrend ?? "normal";

  if (signalsCount >= 3) {
    reasons.push(`${signalsCount} active signals detected`);
  } else if (signalsCount === 2) {
    reasons.push("2 active signals detected");
  } else if (signalsCount === 1) {
    reasons.push("1 active signal detected");
  } else {
    reasons.push("No active signals");
  }

  if (checkInStatus === "missing") {
    reasons.push("Member missed their latest check-in");
  } else if (checkInStatus === "not_great") {
    reasons.push("Latest check-in indicates strain");
  } else if (checkInStatus === "okay") {
    reasons.push("Latest check-in is okay");
  } else {
    reasons.push("Latest check-in is good");
  }

  if (activityTrend === "very_low") {
    reasons.push("Activity trend is very low");
  } else if (activityTrend === "low") {
    reasons.push("Activity trend is lower than normal");
  } else {
    reasons.push("Activity trend is normal");
  }

  const act = getActivityStatus(member);
  reasons.push(`Movement signals: ${act.label}`);

  const wi = getWorkIntensity(member);
  if (wi.level === "overworking") {
    reasons.push("Work intensity is high—extended hours detected");
  } else if (wi.level === "low_engagement") {
    reasons.push("Low engagement with work or study today");
  } else {
    reasons.push("Work rhythm looks balanced");
  }

  return reasons;
}

export function getReconnectionPrompt(member, thresholdDays = 3) {
  if (!member?.lastInteraction) {
    return `You haven't checked in with ${member?.name ?? "this member"} recently`;
  }

  const interactionDate = new Date(member.lastInteraction);
  if (Number.isNaN(interactionDate.getTime())) {
    return `You haven't checked in with ${member?.name ?? "this member"} recently`;
  }

  const daysSinceInteraction =
    (Date.now() - interactionDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceInteraction > thresholdDays) {
    return `You haven't checked in with ${member?.name ?? "this member"} recently`;
  }

  return null;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getCheckInPoints(checkInStatus) {
  const map = {
    good: 25,
    okay: 18,
    not_great: 10,
    missing: 0,
  };
  return map[checkInStatus] ?? 18;
}

/** Activity intelligence layer (0–20) — simulated movement, privacy-safe categories. */
function getActivityIntelligencePoints(member) {
  const act = getActivityStatus(member);
  const map = {
    very_active: 20,
    active: 16,
    steady: 12,
    low_activity: 8,
    inactive: 0,
  };
  return map[act.key] ?? 10;
}

/** Work/study balance factor (0–20). */
function getWorkBalancePoints(member) {
  const wi = getWorkIntensity(member);
  const map = {
    balanced: 20,
    low_engagement: 10,
    overworking: 5,
  };
  return map[wi.level] ?? 10;
}

function getSignalsPoints(signalsCount) {
  if (signalsCount <= 0) return 20;
  if (signalsCount === 1) return 14;
  if (signalsCount === 2) return 8;
  return 0;
}

function getInteractionPoints(lastInteraction) {
  if (!lastInteraction) return 6;

  const interactionDate = new Date(lastInteraction);
  if (Number.isNaN(interactionDate.getTime())) return 6;

  const daysSinceInteraction =
    (Date.now() - interactionDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceInteraction <= 1) return 15;
  if (daysSinceInteraction <= 3) return 11;
  if (daysSinceInteraction <= 7) return 7;
  return 2;
}

function getPositiveEngagementPoints(member) {
  const rawValue =
    member?.positiveEngagement ??
    member?.positiveEngagementScore ??
    member?.engagementScore;

  if (rawValue == null) return 10;

  const engagement = clamp(Number(rawValue), 0, 100);
  return Math.round((engagement / 100) * 15);
}

function getSporeHealthLabelFromScore(score) {
  if (score >= 75) return "Healthy";
  if (score >= 60) return "Needs attention";
  if (score >= 40) return "Strained";
  return "Critical";
}

export function calculateSporeHealth(spore) {
  const members = spore?.members ?? [];
  if (!members.length) {
    return {
      score: 0,
      label: "Critical",
      trend: "stable",
    };
  }

  const memberScores = members.map((member) => {
    const signalsCount = Number(member?.signalsCount ?? 0);
    const score =
      getCheckInPoints(member?.checkInStatus) +
      getActivityIntelligencePoints(member) +
      getWorkBalancePoints(member) +
      getSignalsPoints(signalsCount) +
      getInteractionPoints(member?.lastInteraction) +
      getPositiveEngagementPoints(member);

    return clamp(score, 0, 100);
  });

  const averageScore =
    memberScores.reduce((sum, score) => sum + score, 0) / memberScores.length;

  let finalScore = averageScore;
  const below60 = memberScores.filter((score) => score < 60).length;
  const below50 = memberScores.filter((score) => score < 50).length;

  if (below60 >= 2) {
    finalScore -= 5;
  }
  if (below50 >= 3) {
    finalScore -= 10;
  }

  finalScore = clamp(Math.round(finalScore), 0, 100);

  return {
    score: finalScore,
    label: getSporeHealthLabelFromScore(finalScore),
    trend: "stable", // mock trend for now
  };
}

/** Dashboard copy — counts members in active spores (no raw steps). */
export function summarizeActivityInsights(spores, activeSporeIds) {
  const active = new Set(activeSporeIds ?? []);
  let lowMovementCount = 0;
  let stayedHomeCount = 0;

  for (const spore of spores) {
    if (!active.has(spore.id)) continue;
    for (const m of spore.members ?? []) {
      const st = getActivityStatus(m);
      if (st.key === "inactive" || st.key === "low_activity") {
        lowMovementCount += 1;
      }
      if (m.activityData && m.activityData.leftHomeToday === false) {
        stayedHomeCount += 1;
      }
    }
  }

  return { lowMovementCount, stayedHomeCount };
}

/** Dashboard copy — counts members who are overworking in active spores. */
export function summarizeWorkInsights(spores, activeSporeIds) {
  const active = new Set(activeSporeIds ?? []);
  let overworkingCount = 0;
  let longSessionCount = 0;

  for (const spore of spores) {
    if (!active.has(spore.id)) continue;
    for (const m of spore.members ?? []) {
      const wi = getWorkIntensity(m);
      if (wi.level === "overworking") overworkingCount += 1;
      const sessions = Number(m?.workData?.workSessionsCount ?? 0);
      if (sessions >= 4) longSessionCount += 1;
    }
  }

  return { overworkingCount, longSessionCount };
}

/** Privacy-safe work insights for member profile. */
export function getWorkPrivacyInsights(member) {
  const wd = member?.workData;
  if (!wd) return [];

  const lines = [];
  const mode = wd.workMode;
  if (mode === "home") lines.push("Working from home today");
  else if (mode === "office") lines.push("At office today");

  const wi = getWorkIntensity(member);
  if (wi.level === "overworking") {
    lines.push("Extended work hours — may need a break");
  } else if (wi.level === "low_engagement") {
    lines.push("Low work or study engagement today");
  }

  const sessions = Number(wd.workSessionsCount ?? 0);
  if (sessions >= 4) lines.push("Multiple work sessions today");

  if (lines.length === 0) return ["Balanced work day."];
  return lines;
}

/** Privacy-safe lines for member profile (no exact location or step counts). */
export function getActivityPrivacyInsights(member) {
  const ad = member?.activityData;
  if (!ad) {
    return ["Simulated activity signals aren’t available for this profile."];
  }

  const lines = [];
  if (ad.leftHomeToday === false) {
    lines.push("Stayed home today");
  }

  const st = getActivityStatus(member);
  if (st.key === "inactive") {
    lines.push("Movement looks quiet compared to usual");
  } else if (st.key === "low_activity") {
    lines.push("Movement looks light today");
  }

  const h = Number(ad.lastActiveHoursAgo ?? 0);
  if (h > 20) {
    lines.push("Hasn’t been active on device for a while");
  } else if (h > 8) {
    lines.push("Active earlier today");
  }

  if (lines.length === 0) {
    return ["Moving at a calm, everyday pace."];
  }
  return lines;
}
