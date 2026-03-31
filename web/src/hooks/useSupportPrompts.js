import { useMemo } from "react";
import { useAppState } from "../context/AppStateContext";
import { buildSupportPromptList, getSupportLevel } from "../utils/logic";

export function useSupportPrompts() {
  const { state } = useAppState();
  const { spores, currentUser, settings, handledPromptIds = [] } = state;

  const activeSpores = useMemo(
    () => spores.filter((s) => settings.activeSporeIds.includes(s.id)),
    [spores, settings.activeSporeIds]
  );

  const allPrompts = useMemo(
    () => buildSupportPromptList(activeSpores, currentUser, settings),
    [activeSpores, currentUser, settings]
  );

  const activePrompts = useMemo(
    () => allPrompts.filter((p) => !handledPromptIds.includes(p.id)),
    [allPrompts, handledPromptIds]
  );

  const peopleNeedingSupportCount = useMemo(() => {
    const all = activeSpores.flatMap((s) => s.members);
    return all.filter((m) => getSupportLevel(m).label !== "normal").length;
  }, [activeSpores]);

  return { activeSpores, allPrompts, activePrompts, peopleNeedingSupportCount };
}
