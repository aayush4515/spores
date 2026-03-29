import { useLocalSearchParams } from "expo-router"
import { BottomSheetScaffold } from "@/src/components/layout/BottomSheetScaffold"
import { ObservationFlow } from "@/src/features/care/ObservationFlow"

export default function ObservationModal() {
  const { memberId } = useLocalSearchParams<{ memberId?: string }>()
  return (
    <BottomSheetScaffold>
      <ObservationFlow memberId={memberId} />
    </BottomSheetScaffold>
  )
}
