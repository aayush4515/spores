import { useLocalSearchParams } from "expo-router"
import { BottomSheetScaffold } from "@/src/components/layout/BottomSheetScaffold"
import { AppreciationFlow } from "@/src/features/care/AppreciationFlow"

export default function AppreciationModal() {
  const { memberId } = useLocalSearchParams<{ memberId?: string }>()
  return (
    <BottomSheetScaffold>
      <AppreciationFlow memberId={memberId} />
    </BottomSheetScaffold>
  )
}
