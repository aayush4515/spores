import { BottomSheetScaffold } from "@/src/components/layout/BottomSheetScaffold"
import { HangoutSheet } from "@/src/features/spore/HangoutSheet"

export default function HangoutModal() {
  return (
    <BottomSheetScaffold>
      <HangoutSheet />
    </BottomSheetScaffold>
  )
}
