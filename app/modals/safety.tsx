import { BottomSheetScaffold } from "@/src/components/layout/BottomSheetScaffold"
import { SafetyResourcesSheet } from "@/src/features/profile/SafetyResourcesSheet"

export default function SafetyModal() {
  return (
    <BottomSheetScaffold>
      <SafetyResourcesSheet />
    </BottomSheetScaffold>
  )
}
