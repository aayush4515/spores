import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type {
  AuthSessionState,
  FeatureFlags,
  OnboardingDraft,
  PassiveSignalProviderStatus,
} from "@/src/types/domain"

const defaultFlags: FeatureFlags = {
  multiSpore: true,
  activities: true,
  passiveTracking: true,
  rag: true,
  aiAgent: true,
  serverNotifications: true,
  demoMode: false,
}

function createDefaultOnboardingDraft(partial: Partial<OnboardingDraft> = {}): OnboardingDraft {
  return {
    mode: null,
    displayName: "",
    sporeName: "",
    inviteCode: "",
    invitedEmails: [],
    consentAccepted: false,
    sharingStyle: "Balanced sharing",
    supportStyle: [],
    alertPrefs: ["Gentle nudges"],
    avatar: "🌱",
    ...partial,
  }
}

type AppState = {
  auth: AuthSessionState
  activeSporeId?: string
  featureFlags: FeatureFlags
  onboardingDraft: OnboardingDraft
  providerStatuses: PassiveSignalProviderStatus[]
  pushToken?: string
  setAuth: (auth: AuthSessionState) => void
  setActiveSporeId: (id?: string) => void
  setFeatureFlag: <K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]) => void
  resetDemoMode: () => void
  updateOnboarding: (partial: Partial<OnboardingDraft>) => void
  resetOnboardingDraft: (partial?: Partial<OnboardingDraft>) => void
  setProviderStatuses: (statuses: PassiveSignalProviderStatus[]) => void
  setPushToken: (token?: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      auth: { status: "booting", profile: null },
      activeSporeId: undefined,
      featureFlags: defaultFlags,
      onboardingDraft: createDefaultOnboardingDraft(),
      providerStatuses: [],
      pushToken: undefined,
      setAuth: (auth) =>
        set((state) => ({
          auth,
          activeSporeId: auth.profile?.activeSporeId ?? state.activeSporeId,
        })),
      setActiveSporeId: (activeSporeId) => set({ activeSporeId }),
      setFeatureFlag: (key, value) =>
        set((state) => ({
          featureFlags: { ...state.featureFlags, [key]: value },
        })),
      resetDemoMode: () =>
        set((state) => ({
          featureFlags: { ...state.featureFlags, demoMode: false },
        })),
      updateOnboarding: (partial) =>
        set((state) => ({
          onboardingDraft: { ...state.onboardingDraft, ...partial },
        })),
      resetOnboardingDraft: (partial) =>
        set({
          onboardingDraft: createDefaultOnboardingDraft(partial),
        }),
      setProviderStatuses: (providerStatuses) => set({ providerStatuses }),
      setPushToken: (pushToken) => set({ pushToken }),
    }),
    {
      name: "spores-app-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeSporeId: state.activeSporeId,
        featureFlags: state.featureFlags,
        onboardingDraft: state.onboardingDraft,
        providerStatuses: state.providerStatuses,
        pushToken: state.pushToken,
      }),
    }
  )
)
