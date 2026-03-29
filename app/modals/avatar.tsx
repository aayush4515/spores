import { BottomSheetScaffold } from "@/src/components/layout/BottomSheetScaffold"
import { AvatarSheet } from "@/src/features/profile/AvatarSheet"

export default function AvatarModal() {
  return (
    <BottomSheetScaffold>
      <AvatarSheet />
    </BottomSheetScaffold>
  )
}
