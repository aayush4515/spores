import * as Linking from "expo-linking"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { Card, SectionTitle } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

const resources = [
  {
    title: "988 Lifeline",
    body: "Call or text 988",
    action: "tel:988",
  },
  {
    title: "Crisis Text Line",
    body: "Text HOME to 741741",
    action: "sms:741741",
  },
]

export function SafetyResourcesSheet() {
  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>You’re not alone</Text>
        <Text style={styles.subtitle}>Immediate support, trusted contacts, and grounding tools should stay easy to reach.</Text>
      </View>
      <View style={styles.list}>
        {resources.map((resource) => (
          <Pressable key={resource.title} style={styles.resourceCard} onPress={() => Linking.openURL(resource.action)}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <Text style={styles.resourceSubtitle}>{resource.body}</Text>
          </Pressable>
        ))}
      </View>
      <Card accent>
        <SectionTitle title="Grounding tools" />
        {["3-minute breathing", "5-4-3-2-1 grounding", "Self-compassion reset"].map((item) => (
          <View key={item} style={styles.toolRow}>
            <Text style={styles.toolText}>{item}</Text>
          </View>
        ))}
      </Card>
      <Card>
        <Text style={styles.contactTitle}>Trusted contacts</Text>
        <Text style={styles.contactBody}>Support phone and crisis preferences can be edited from Settings.</Text>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  header: { alignItems: "center", gap: spacing.xs },
  title: { color: colors.foreground, fontSize: 22, fontWeight: "600" },
  subtitle: { color: colors.mutedForeground, textAlign: "center", lineHeight: 20 },
  list: { gap: spacing.sm },
  resourceCard: {
    backgroundColor: colors.secondary,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  resourceTitle: { color: colors.secondaryForeground, fontWeight: "600" },
  resourceSubtitle: { color: colors.secondaryForeground, marginTop: 4 },
  toolRow: { paddingVertical: spacing.sm },
  toolText: { color: colors.secondaryForeground },
  contactTitle: { color: colors.foreground, fontWeight: "600" },
  contactBody: { color: colors.mutedForeground, marginTop: 4, lineHeight: 20 },
})
