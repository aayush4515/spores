import { BottomSheetScaffold } from "@/src/components/layout/BottomSheetScaffold"
import { ChallengeDetailSheet } from "@/src/features/challenges/ChallengeDetailSheet"

export default function ChallengeDetailModal() {
  return (
    <BottomSheetScaffold>
      <ChallengeDetailSheet />
    </BottomSheetScaffold>
  )
}
