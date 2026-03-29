import { BottomSheetScaffold } from "@/src/components/layout/BottomSheetScaffold"
import { InviteSheet } from "@/src/features/spore/InviteSheet"

export default function InviteModal() {
  return (
    <BottomSheetScaffold>
      <InviteSheet />
    </BottomSheetScaffold>
  )
}
