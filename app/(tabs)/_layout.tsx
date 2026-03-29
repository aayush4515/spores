import { Tabs } from "expo-router"
import { BottomTabBar } from "@/src/components/layout/BottomTabBar"

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomTabBar {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="spore" />
      <Tabs.Screen name="challenges" />
      <Tabs.Screen name="ai" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )
}
