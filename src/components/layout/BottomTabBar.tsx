import { BlurView } from "expo-blur"
import { Tabs } from "expo-router"
import { Home, MessageCircle, Sparkles, User, Users } from "lucide-react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { colors, radii, spacing, typography } from "@/src/theme/tokens"

type IconType = typeof Home

const items: Record<string, { label: string; icon: IconType }> = {
  home: { label: "Home", icon: Home },
  spore: { label: "Spore", icon: Users },
  challenges: { label: "Grow", icon: Sparkles },
  ai: { label: "Listen", icon: MessageCircle },
  profile: { label: "You", icon: User },
}

export function BottomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.outer}>
      <BlurView intensity={85} tint="light" style={styles.blur}>
        {state.routes.map((route: { name: string; key: string }, index: number) => {
          const focused = state.index === index
          const meta = items[route.name]
          const Icon = meta?.icon ?? Home
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          return (
            <Pressable
              accessibilityRole="button"
              key={route.key}
              onPress={onPress}
              style={styles.item}
            >
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Icon
                  size={22}
                  strokeWidth={focused ? 2.25 : 1.85}
                  color={focused ? colors.primary : colors.mutedForeground}
                />
              </View>
              <Text style={[styles.label, focused && styles.labelActive]}>
                {meta?.label ?? descriptors[route.key]?.options.title ?? route.name}
              </Text>
            </Pressable>
          )
        })}
      </BlurView>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: "transparent",
  },
  blur: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 28,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  item: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: colors.secondary,
  },
  label: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontFamily: typography.sans,
    fontWeight: "600",
  },
  labelActive: {
    color: colors.primary,
  },
})
