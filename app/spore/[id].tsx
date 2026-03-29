import { useLocalSearchParams } from "expo-router"
import { SporeDetailScreen } from "@/src/features/spore/SporeDetailScreen"

export default function SporeWorkspaceRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <SporeDetailScreen sporeId={id} />
}
