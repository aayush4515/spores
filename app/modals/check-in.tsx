import { BottomSheetScaffold } from "@/src/components/layout/BottomSheetScaffold"
import { CheckInFlow } from "@/src/features/care/CheckInFlow"

export default function CheckInModal() {
  return (
    <BottomSheetScaffold>
      <CheckInFlow />
    </BottomSheetScaffold>
  )
}
