/** Simulated wellness signals only — no real APIs, no raw location. */

const lowAarav = {
  leftHomeToday: false,
  stepsCount: 800,
  visitedGym: false,
  wentOutside: false,
  lastActiveHoursAgo: 18,
};

const lowNeel = {
  leftHomeToday: false,
  stepsCount: 300,
  visitedGym: false,
  wentOutside: false,
  lastActiveHoursAgo: 30,
};

const healthyMaya = {
  leftHomeToday: true,
  stepsCount: 7500,
  visitedGym: true,
  wentOutside: true,
  lastActiveHoursAgo: 2,
};

const veryHealthyRiya = {
  leftHomeToday: true,
  stepsCount: 9800,
  visitedGym: true,
  wentOutside: true,
  lastActiveHoursAgo: 1,
};

const moderateKiran = {
  leftHomeToday: true,
  stepsCount: 4200,
  visitedGym: false,
  wentOutside: true,
  lastActiveHoursAgo: 5,
};

const healthySita = {
  leftHomeToday: true,
  stepsCount: 6200,
  visitedGym: false,
  wentOutside: true,
  lastActiveHoursAgo: 3,
};

const healthyRonit = {
  leftHomeToday: true,
  stepsCount: 6800,
  visitedGym: false,
  wentOutside: true,
  lastActiveHoursAgo: 2,
};

const strugglingKiara = {
  leftHomeToday: false,
  stepsCount: 1200,
  visitedGym: false,
  wentOutside: false,
  lastActiveHoursAgo: 22,
};

const veryActiveArjun = {
  leftHomeToday: true,
  stepsCount: 11000,
  visitedGym: true,
  wentOutside: true,
  lastActiveHoursAgo: 1,
};

const healthyPriya = {
  leftHomeToday: true,
  stepsCount: 7200,
  visitedGym: false,
  wentOutside: true,
  lastActiveHoursAgo: 2,
};

const moderateDev = {
  leftHomeToday: true,
  stepsCount: 3800,
  visitedGym: false,
  wentOutside: true,
  lastActiveHoursAgo: 6,
};

const healthyAnika = {
  leftHomeToday: true,
  stepsCount: 5900,
  visitedGym: true,
  wentOutside: true,
  lastActiveHoursAgo: 2,
};

function bikeMember(steps, gym, lastH = 2) {
  return {
    leftHomeToday: true,
    stepsCount: steps,
    visitedGym: gym,
    wentOutside: true,
    lastActiveHoursAgo: lastH,
  };
}

/* ── Work / study intensity (simulated) ── */

const workNeel = {
  workMode: "home",
  hoursWorkedToday: 11,
  workSessionsCount: 5,
  lastWorkActivityHoursAgo: 1,
  manualWorkEntry: true,
};

const workAarav = {
  workMode: "unknown",
  hoursWorkedToday: 1,
  workSessionsCount: 1,
  lastWorkActivityHoursAgo: 10,
};

const workMaya = {
  workMode: "office",
  hoursWorkedToday: 7,
  workSessionsCount: 3,
  lastWorkActivityHoursAgo: 3,
};

const workRiya = {
  workMode: "office",
  hoursWorkedToday: 6,
  workSessionsCount: 2,
  lastWorkActivityHoursAgo: 4,
};

const workKiran = {
  workMode: "home",
  hoursWorkedToday: 8,
  workSessionsCount: 3,
  lastWorkActivityHoursAgo: 2,
};

const workSita = {
  workMode: "office",
  hoursWorkedToday: 7,
  workSessionsCount: 3,
  lastWorkActivityHoursAgo: 3,
};

const workRonit = {
  workMode: "office",
  hoursWorkedToday: 8,
  workSessionsCount: 3,
  lastWorkActivityHoursAgo: 2,
};

const workKiara = {
  workMode: "home",
  hoursWorkedToday: 10,
  workSessionsCount: 4,
  lastWorkActivityHoursAgo: 1,
};

const workArjun = {
  workMode: "office",
  hoursWorkedToday: 7,
  workSessionsCount: 3,
  lastWorkActivityHoursAgo: 4,
};

const workPriya = {
  workMode: "office",
  hoursWorkedToday: 6,
  workSessionsCount: 2,
  lastWorkActivityHoursAgo: 5,
};

const workDev = {
  workMode: "home",
  hoursWorkedToday: 4,
  workSessionsCount: 2,
  lastWorkActivityHoursAgo: 6,
};

const workAnika = {
  workMode: "office",
  hoursWorkedToday: 7,
  workSessionsCount: 3,
  lastWorkActivityHoursAgo: 3,
};

function bikeWork(hours, sessions, lastH) {
  return {
    workMode: "office",
    hoursWorkedToday: hours,
    workSessionsCount: sessions,
    lastWorkActivityHoursAgo: lastH,
  };
}

export const appMockData = {
  currentUser: {
    id: "u-1",
    name: "Elena",
    email: "elena@spore.app",
    primarySporeId: "spore-family",
    checkInStatus: "okay",
    activityTrend: "normal",
    signalsCount: 0,
    lastInteraction: "2026-03-28T08:30:00.000Z",
    activityData: {
      leftHomeToday: true,
      stepsCount: 5400,
      visitedGym: false,
      wentOutside: true,
      lastActiveHoursAgo: 3,
    },
    workData: {
      workMode: "home",
      hoursWorkedToday: 6,
      workSessionsCount: 2,
      lastWorkActivityHoursAgo: 4,
    },
  },
  spores: [
    {
      id: "spore-family",
      name: "Family Spore",
      type: "family",
      members: [
        {
          id: "m-neel",
          name: "Neel",
          checkInStatus: "missing",
          activityTrend: "very_low",
          signalsCount: 0,
          lastInteraction: "2026-03-24T09:12:00.000Z",
          activityData: { ...lowNeel },
          workData: { ...workNeel },
        },
        {
          id: "m-aarav",
          name: "Aarav",
          checkInStatus: "okay",
          activityTrend: "low",
          signalsCount: 2,
          lastInteraction: "2026-03-27T19:45:00.000Z",
          activityData: { ...lowAarav },
          workData: { ...workAarav },
        },
        {
          id: "m-maya",
          name: "Maya",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T07:18:00.000Z",
          activityData: { ...healthyMaya },
          workData: { ...workMaya },
        },
        {
          id: "m-riya",
          name: "Riya",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T08:00:00.000Z",
          activityData: { ...veryHealthyRiya },
          workData: { ...workRiya },
        },
        {
          id: "m-kiran",
          name: "Kiran",
          checkInStatus: "okay",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-27T14:20:00.000Z",
          activityData: { ...moderateKiran },
          workData: { ...workKiran },
        },
        {
          id: "m-sita",
          name: "Sita",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T06:45:00.000Z",
          activityData: { ...healthySita },
          workData: { ...workSita },
        },
      ],
    },
    {
      id: "spore-friends",
      name: "Friends Circle",
      type: "friends",
      members: [
        {
          id: "m-ronit",
          name: "Ronit",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-27T21:03:00.000Z",
          activityData: { ...healthyRonit },
          workData: { ...workRonit },
        },
        {
          id: "m-kiara",
          name: "Kiara",
          checkInStatus: "not_great",
          activityTrend: "low",
          signalsCount: 1,
          lastInteraction: "2026-03-26T16:20:00.000Z",
          activityData: { ...strugglingKiara },
          workData: { ...workKiara },
        },
        {
          id: "m-arjun",
          name: "Arjun",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T07:50:00.000Z",
          activityData: { ...veryActiveArjun },
          workData: { ...workArjun },
        },
        {
          id: "m-priya",
          name: "Priya",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T08:10:00.000Z",
          activityData: { ...healthyPriya },
          workData: { ...workPriya },
        },
        {
          id: "m-dev",
          name: "Dev",
          checkInStatus: "okay",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-27T18:00:00.000Z",
          activityData: { ...moderateDev },
          workData: { ...workDev },
        },
        {
          id: "m-anika",
          name: "Anika",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T07:00:00.000Z",
          activityData: { ...healthyAnika },
          workData: { ...workAnika },
        },
      ],
    },
    {
      id: "spore-biking",
      name: "Biking Crew",
      type: "fitness",
      members: [
        {
          id: "m-bike-leo",
          name: "Leo",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T08:40:00.000Z",
          activityData: bikeMember(10200, true, 2),
          workData: bikeWork(6, 2, 4),
        },
        {
          id: "m-bike-sam",
          name: "Sam",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T08:35:00.000Z",
          activityData: bikeMember(7800, false, 2),
          workData: bikeWork(7, 3, 3),
        },
        {
          id: "m-bike-tara",
          name: "Tara",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T08:28:00.000Z",
          activityData: bikeMember(9100, true, 1),
          workData: bikeWork(5, 2, 5),
        },
        {
          id: "m-bike-jules",
          name: "Jules",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T08:22:00.000Z",
          activityData: bikeMember(6500, false, 2),
          workData: bikeWork(8, 3, 2),
        },
        {
          id: "m-bike-om",
          name: "Om",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T08:15:00.000Z",
          activityData: bikeMember(12000, true, 2),
          workData: bikeWork(7, 3, 3),
        },
        {
          id: "m-bike-zoe",
          name: "Zoe",
          checkInStatus: "good",
          activityTrend: "normal",
          signalsCount: 0,
          lastInteraction: "2026-03-28T08:08:00.000Z",
          activityData: bikeMember(8400, false, 3),
          workData: bikeWork(6, 2, 4),
        },
      ],
    },
  ],
};
