import { MessageCircle, Send, X } from "lucide-react-native"
import { useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useAppStore } from "@/src/store/app-store"
import { useSendSporeMessage, useSporeMessages } from "@/src/features/spore/api"
import { InputField } from "@/src/components/ui/primitives"
import { colors, radii, shadows, spacing } from "@/src/theme/tokens"

export function SporeChatOverlay({ sporeId }: { sporeId: string }) {
  const currentUserId = useAppStore((state) => state.auth.profile?.id)
  const { data: messages = [] } = useSporeMessages(sporeId)
  const sendMessage = useSendSporeMessage(sporeId)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState("")

  const submit = async () => {
    if (!draft.trim()) return
    const next = draft
    setDraft("")
    await sendMessage.mutateAsync(next)
  }

  return (
    <>
      <Pressable style={styles.bubble} onPress={() => setOpen(true)}>
        <MessageCircle size={18} color={colors.primaryForeground} />
        <Text style={styles.bubbleLabel}>Chat</Text>
      </Pressable>

      {open ? (
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.panel} onPress={(event) => event.stopPropagation()}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Spore chat</Text>
                <Text style={styles.subtitle}>A shared thread for this workspace</Text>
              </View>
              <Pressable style={styles.closeButton} onPress={() => setOpen(false)}>
                <X size={16} color={colors.foreground} />
              </Pressable>
            </View>

            <ScrollView style={styles.messageScroll} contentContainerStyle={styles.messageContent}>
              {messages.length ? (
                messages.map((message) => {
                  const isSelf = message.authorId === currentUserId && message.messageType === "user"
                  const isSystem = message.messageType === "system"
                  return (
                    <View
                      key={message.id}
                      style={[
                        styles.messageRow,
                        isSelf && styles.messageRowSelf,
                        isSystem && styles.messageRowSystem,
                      ]}
                    >
                      <View
                        style={[
                          styles.messageBubble,
                          isSelf && styles.messageBubbleSelf,
                          isSystem && styles.messageBubbleSystem,
                        ]}
                      >
                        {!isSelf && !isSystem ? (
                          <Text style={styles.authorText}>{message.authorName ?? "Member"}</Text>
                        ) : null}
                        <Text
                          style={[
                            styles.messageText,
                            isSelf && styles.messageTextSelf,
                            isSystem && styles.messageTextSystem,
                          ]}
                        >
                          {message.body}
                        </Text>
                      </View>
                    </View>
                  )
                })
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No messages yet</Text>
                  <Text style={styles.emptyText}>Start with a small note or let a challenge announcement break the ice.</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputRow}>
              <View style={{ flex: 1 }}>
                <InputField
                  placeholder="Send a message to your Spore..."
                  value={draft}
                  onChangeText={setDraft}
                />
              </View>
              <Pressable
                style={[styles.sendButton, (!draft.trim() || sendMessage.isPending) && styles.sendButtonDisabled]}
                onPress={() => void submit()}
                disabled={!draft.trim() || sendMessage.isPending}
              >
                <Send size={16} color={colors.primaryForeground} />
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    right: spacing.xl,
    bottom: spacing.xxl + spacing.lg,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    ...shadows.soft,
  },
  bubbleLabel: {
    color: colors.primaryForeground,
    fontWeight: "600",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
    padding: spacing.xl,
  },
  panel: {
    width: "95%",
    alignSelf: "center",
    maxHeight: "72%",
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.soft,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.mutedForeground,
    marginTop: 4,
    fontSize: 13,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.muted,
  },
  messageScroll: {
    maxHeight: 320,
  },
  messageContent: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  messageRow: {
    flexDirection: "row",
  },
  messageRowSelf: {
    justifyContent: "flex-end",
  },
  messageRowSystem: {
    justifyContent: "center",
  },
  messageBubble: {
    maxWidth: "86%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
  },
  messageBubbleSelf: {
    backgroundColor: colors.primary,
  },
  messageBubbleSystem: {
    backgroundColor: colors.secondary,
  },
  authorText: {
    color: colors.mutedForeground,
    fontSize: 11,
    marginBottom: 4,
  },
  messageText: {
    color: colors.foreground,
    lineHeight: 18,
  },
  messageTextSelf: {
    color: colors.primaryForeground,
  },
  messageTextSystem: {
    color: colors.secondaryForeground,
    textAlign: "center",
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  emptyTitle: {
    color: colors.foreground,
    fontWeight: "600",
  },
  emptyText: {
    color: colors.mutedForeground,
    textAlign: "center",
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  inputRow: {
    marginTop: spacing.md,
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
    opacity: 0.6,
  },
})
