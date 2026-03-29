import { BottomSheetScaffold } from "@/src/components/layout/BottomSheetScaffold"
import { MemberDetailSheet } from "@/src/features/spore/MemberDetailSheet"

export default function MemberDetailModal() {
  return (
    <BottomSheetScaffold>
      <MemberDetailSheet />
    </BottomSheetScaffold>
  )
}
