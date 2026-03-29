import { BottomSheetScaffold } from "@/src/components/layout/BottomSheetScaffold"
import { NewChallengeFlow } from "@/src/features/challenges/NewChallengeFlow"

export default function NewChallengeModal() {
  return (
    <BottomSheetScaffold>
      <NewChallengeFlow />
    </BottomSheetScaffold>
  )
}
