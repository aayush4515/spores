import { Send } from "lucide-react-native"
import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useAppStore } from "@/src/store/app-store"
import { useConversation, useSendAIMessage } from "@/src/features/ai/api"
import { Card, InputField, PageHeader, Pill, ScreenView } from "@/src/components/ui/primitives"
import { colors, radii, spacing } from "@/src/theme/tokens"

const prompts = [
  "What’s on my mind",
  "I need to process",
  "Share gratitude",
  "Guide my breathing",
]

export function AIScreen() {
  const [input, setInput] = useState("")
  const activeSporeId =
    useAppStore((state) => state.activeSporeId) ??
    useAppStore((state) => state.auth.profile?.activeSporeId) ??
    ""
  const { data: messages = [] } = useConversation(activeSporeId ?? undefined)
  const sendMutation = useSendAIMessage(activeSporeId)

  const send = async (content = input) => {
    if (!content.trim()) return
    setInput("")
    try {
      await sendMutation.mutateAsync(content)
    } catch {
      // Keep the input clear and surface the message below.
    }
  }

  return (
    <ScreenView contentContainerStyle={styles.content}>
      <PageHeader title="Listener" subtitle="A quiet space to reflect." />

      <Card accent>
        <Text style={styles.disclaimer}>
          A supportive companion, not a therapist. For crisis support, open Safety.
        </Text>
      </Card>

      {!activeSporeId ? (
        <Card accent>
          <Text style={styles.emptyStateText}>
            Create or join a Spore before using Listener so responses can stay grounded in your circle and care context.
          </Text>
        </Card>
      ) : null}

      <View style={styles.messageList}>
        {messages.map((message) => {
          const isUser = message.role === "user"
          return (
            <View key={message.id} style={[styles.messageRow, isUser && styles.messageRowReverse]}>
              {!isUser ? <View style={styles.assistantBubbleMark} /> : null}
              <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
                <Text style={[styles.messageText, isUser && { color: colors.primaryForeground }]}>
                  {message.content}
                </Text>
                {!isUser && message.citations?.length ? (
                  <Text style={styles.citationText}>Context: {message.citations.join(", ")}</Text>
                ) : null}
              </View>
            </View>
          )
        })}
      </View>

      {messages.length <= 1 ? (
        <View style={styles.promptRow}>
          {prompts.map((prompt) => (
            <Pill key={prompt} label={prompt} onPress={() => send(prompt)} />
          ))}
        </View>
      ) : null}

      {sendMutation.error ? <Text style={styles.errorText}>{sendMutation.error.message}</Text> : null}

      <View style={styles.inputRow}>
        <View style={{ flex: 1 }}>
          <InputField
            placeholder="Share what’s on your mind..."
            value={input}
            onChangeText={setInput}
          />
        </View>
        <Pressable
          disabled={!input.trim() || sendMutation.isPending || !activeSporeId}
          onPress={() => send()}
          style={[styles.sendButton, (!input.trim() || sendMutation.isPending || !activeSporeId) && styles.sendButtonDisabled]}
        >
          <Send
            size={16}
            color={!input.trim() || sendMutation.isPending || !activeSporeId ? colors.mutedForeground : colors.primaryForeground}
          />
        </Pressable>
      </View>
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  disclaimer: {
    color: colors.mutedForeground,
    lineHeight: 20,
    fontSize: 13,
  },
  emptyStateText: {
    color: colors.mutedForeground,
    lineHeight: 20,
    fontSize: 13,
  },
  messageList: {
    gap: spacing.md,
  },
  messageRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-end",
  },
  messageRowReverse: {
    justifyContent: "flex-end",
  },
  assistantBubbleMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondary,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
  },
  assistantBubble: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userBubble: {
    backgroundColor: colors.primary,
  },
  messageText: {
    color: colors.foreground,
    lineHeight: 20,
  },
  citationText: {
    marginTop: spacing.sm,
    color: colors.mutedForeground,
    fontSize: 11,
  },
  promptRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  errorText: {
    color: colors.destructive,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.muted,
  },
})
