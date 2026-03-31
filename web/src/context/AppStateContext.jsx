import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { appMockData } from "../data/appMockData";

const AppStateContext = createContext(null);

const defaultSettings = {
  activityTracking: true,
  supportPrompts: true,
  activeSporeIds: appMockData.spores.map((spore) => spore.id),
};

function AppStateProvider({ children }) {
  const [state, setState] = useState({
    currentUser: appMockData.currentUser,
    spores: appMockData.spores,
    settings: defaultSettings,
    handledPromptIds: [],
    checkInNote: "",
  });

  function updateCurrentUserCheckIn(checkInStatus) {
    setState((prev) => ({
      ...prev,
      currentUser: {
        ...prev.currentUser,
        checkInStatus,
        signalsCount: checkInStatus === "missing" ? 3 : 0,
        activityTrend: checkInStatus === "missing" ? "very_low" : "normal",
        lastInteraction: new Date().toISOString(),
      },
      handledPromptIds: prev.handledPromptIds.filter((id) => id !== "current-user-support"),
    }));
  }

  function saveCheckInNote(note) {
    setState((prev) => ({ ...prev, checkInNote: note }));
  }

  function dismissPrompt(promptId) {
    setState((prev) => ({
      ...prev,
      handledPromptIds: prev.handledPromptIds.includes(promptId)
        ? prev.handledPromptIds
        : [...prev.handledPromptIds, promptId],
    }));
  }

  function addSignal(sporeId, memberId) {
    setState((prev) => ({
      ...prev,
      spores: prev.spores.map((spore) => {
        if (spore.id !== sporeId) {
          return spore;
        }
        return {
          ...spore,
          members: spore.members.map((member) =>
            member.id === memberId
              ? {
                  ...member,
                  signalsCount: Number(member.signalsCount ?? 0) + 1,
                  lastInteraction: new Date().toISOString(),
                }
              : member
          ),
        };
      }),
    }));
  }

  function updateMember(memberId, updater) {
    setState((prev) => ({
      ...prev,
      spores: prev.spores.map((spore) => ({
        ...spore,
        members: spore.members.map((member) => {
          if (member.id !== memberId) {
            return member;
          }
          return typeof updater === "function" ? updater(member) : member;
        }),
      })),
    }));
  }

  function updateCurrentUserWorkData(workData) {
    setState((prev) => ({
      ...prev,
      currentUser: {
        ...prev.currentUser,
        workData: { ...prev.currentUser.workData, ...workData },
      },
    }));
  }

  function toggleSetting(settingKey) {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [settingKey]: !prev.settings[settingKey],
      },
    }));
  }

  function toggleActiveSpore(sporeId) {
    setState((prev) => {
      const isActive = prev.settings.activeSporeIds.includes(sporeId);
      return {
        ...prev,
        settings: {
          ...prev.settings,
          activeSporeIds: isActive
            ? prev.settings.activeSporeIds.filter((id) => id !== sporeId)
            : [...prev.settings.activeSporeIds, sporeId],
        },
      };
    });
  }

  const createSpore = useCallback(({ name, type, invites = [] }) => {
    const id = `spore-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const now = new Date().toISOString();
    const members = invites.map((raw, i) => {
      const label = String(raw).trim();
      const displayName = label.includes("@") ? label.split("@")[0] : label || `Friend ${i + 1}`;
      return {
        id: `m-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
        name: displayName,
        checkInStatus: "okay",
        activityTrend: "normal",
        signalsCount: 0,
        lastInteraction: now,
        activityData: {
          leftHomeToday: true,
          stepsCount: 4500,
          visitedGym: false,
          wentOutside: true,
          lastActiveHoursAgo: 4,
        },
        workData: {
          workMode: "unknown",
          hoursWorkedToday: 0,
          workSessionsCount: 0,
          lastWorkActivityHoursAgo: 99,
        },
      };
    });
    const newSpore = { id, name, type, members };

    setState((prev) => ({
      ...prev,
      spores: [...prev.spores, newSpore],
      settings: {
        ...prev.settings,
        activeSporeIds: prev.settings.activeSporeIds.includes(id)
          ? prev.settings.activeSporeIds
          : [...prev.settings.activeSporeIds, id],
      },
    }));
    return id;
  }, []);

  const deleteMyData = useCallback(() => {
    setState((prev) => {
      const now = new Date().toISOString();
      const defaultActivity = {
        leftHomeToday: true,
        stepsCount: 5000,
        visitedGym: false,
        wentOutside: true,
        lastActiveHoursAgo: 2,
      };
      const defaultWork = {
        workMode: "unknown",
        hoursWorkedToday: 0,
        workSessionsCount: 0,
        lastWorkActivityHoursAgo: 99,
      };
      return {
        ...prev,
        handledPromptIds: [],
        currentUser: {
          ...prev.currentUser,
          checkInStatus: "okay",
          signalsCount: 0,
          activityTrend: "normal",
          lastInteraction: now,
          activityData: defaultActivity,
          workData: defaultWork,
        },
        spores: prev.spores.map((spore) => ({
          ...spore,
          members: spore.members.map((m) => ({
            ...m,
            signalsCount: 0,
            checkInStatus: "okay",
            activityTrend: "normal",
            lastInteraction: now,
            activityData: defaultActivity,
            workData: defaultWork,
          })),
        })),
      };
    });
  }, []);

  const leaveSupportSystem = useCallback(() => {
    setState({
      currentUser: { ...appMockData.currentUser },
      spores: [],
      settings: {
        activityTracking: true,
        supportPrompts: true,
        activeSporeIds: [],
      },
      handledPromptIds: [],
    });
  }, []);

  const value = useMemo(
    () => ({
      state,
      updateCurrentUserCheckIn,
      saveCheckInNote,
      updateCurrentUserWorkData,
      addSignal,
      updateMember,
      toggleSetting,
      toggleActiveSpore,
      dismissPrompt,
      createSpore,
      deleteMyData,
      leaveSupportSystem,
    }),
    [state, createSpore, deleteMyData, leaveSupportSystem]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}

export { AppStateProvider };
