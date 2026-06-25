import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import {
  getFollowUps,
  getReportLink,
  QUICK_STARTS,
  type ChatMessage,
} from '@/lib/recbrain-content';

const CHATBOT_LOGO = require('@/assets/images/NREP-AI.png');

type RecChatbotModalProps = {
  visible: boolean;
  connected: boolean;
  messages: ChatMessage[];
  thinking: boolean;
  streaming: string;
  isStreaming: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  onClear: () => void;
};

function MessageBubble({
  message,
  onFollowUp,
}: {
  message: ChatMessage;
  onFollowUp: (text: string) => void;
}) {
  const isUser = message.role === 'user';
  const reportLink = !isUser ? getReportLink(message.content) : null;

  if (isUser) {
    return (
      <View style={[styles.bubbleRow, styles.bubbleRowUser]}>
        <View style={[styles.bubble, styles.bubbleUser]}>
          <Text style={[styles.bubbleText, styles.bubbleTextUser]}>{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAssistant]}>
      {!isUser ? (
        <Image source={CHATBOT_LOGO} style={styles.avatar} resizeMode="cover" />
      ) : null}
      <View style={styles.bubbleColumn}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant]}>
            {message.content}
          </Text>
          {message.sources.length > 0 ? (
            <Text style={styles.sourcesText}>Sources: {message.sources.join(' · ')}</Text>
          ) : null}
        </View>

        {reportLink ? (
          <Pressable style={styles.reportBtn} onPress={() => Linking.openURL(reportLink.url)}>
            <Text style={styles.reportBtnText}>{reportLink.label}</Text>
            <Ionicons name="open-outline" size={12} color="#2d6b27" />
          </Pressable>
        ) : null}

        {!isUser && message.showFollowUps ? (
          <View style={styles.followUpRow}>
            {getFollowUps(message.content).map((question) => (
              <Pressable key={question} style={styles.followUpChip} onPress={() => onFollowUp(question)}>
                <Text style={styles.followUpText}>{question}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function RecChatbotModal({
  visible,
  connected,
  messages,
  thinking,
  streaming,
  isStreaming,
  onClose,
  onSend,
  onClear,
}: RecChatbotModalProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(timer);
  }, [messages, streaming, thinking, visible]);

  const busy = thinking || isStreaming;
  const showQuickStarts = messages.length <= 1;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerLeft}>
            <Image source={CHATBOT_LOGO} style={styles.headerLogo} resizeMode="cover" />
            <View>
              <Text style={styles.headerTitle}>REC Assistant</Text>
              <Text style={styles.headerSubtitle}>Renewable Energy Conference · REC22 – REC26</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, connected ? styles.statusOnline : styles.statusOffline]} />
              <Text style={styles.statusText}>{connected ? 'Online' : 'Offline'}</Text>
            </View>
            <Pressable onPress={onClear} hitSlop={8} style={styles.iconBtn}>
              <Ionicons name="refresh-outline" size={20} color={colors.primary} />
            </Pressable>
            <Pressable onPress={onClose} hitSlop={8} style={styles.iconBtn}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {showQuickStarts ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
            {QUICK_STARTS.map((question) => (
              <Pressable key={question} style={styles.quickChip} onPress={() => onSend(question)}>
                <Text style={styles.quickChipText}>{question}</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}

        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} onFollowUp={onSend} />
          ))}

          {streaming ? (
            <View style={[styles.bubbleRow, styles.bubbleRowAssistant]}>
              <Image source={CHATBOT_LOGO} style={styles.avatar} resizeMode="cover" />
              <View style={[styles.bubble, styles.bubbleAssistant]}>
                <Text style={styles.bubbleTextAssistant}>
                  {streaming}
                  <Text style={styles.cursor}>|</Text>
                </Text>
              </View>
            </View>
          ) : null}

          {thinking ? (
            <View style={[styles.bubbleRow, styles.bubbleRowAssistant]}>
              <Image source={CHATBOT_LOGO} style={styles.avatar} resizeMode="cover" />
              <View style={[styles.bubble, styles.bubbleAssistant, styles.thinkingBubble]}>
                <ActivityIndicator size="small" color="#5BAD4E" />
                <Text style={styles.thinkingText}>Thinking...</Text>
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about REC22, REC23, REC24, REC25, or REC26..."
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            multiline
            editable={!busy}
            onSubmitEditing={() => {
              if (!input.trim()) return;
              onSend(input);
              setInput('');
            }}
          />
          <Pressable
            style={[styles.sendBtn, (!input.trim() || busy) && styles.sendBtnDisabled]}
            disabled={!input.trim() || busy}
            onPress={() => {
              onSend(input);
              setInput('');
            }}
          >
            <Ionicons name="send" size={18} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4FBF3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  headerLogo: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2d6b27',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#5BAD4E',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusOnline: {
    backgroundColor: '#5BAD4E',
  },
  statusOffline: {
    backgroundColor: '#DC2626',
  },
  statusText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  iconBtn: {
    padding: 6,
  },
  quickRow: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quickChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#D4EBD0',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  quickChipText: {
    fontSize: 12,
    color: '#2d5a27',
    fontWeight: '600',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 14,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowAssistant: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginTop: 2,
  },
  bubbleColumn: {
    maxWidth: '82%',
    gap: 6,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: '#5BAD4E',
    borderTopRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E8F5E4',
    borderTopLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 21,
  },
  bubbleTextUser: {
    color: colors.white,
  },
  bubbleTextAssistant: {
    color: '#1a2e1a',
  },
  sourcesText: {
    marginTop: 8,
    fontSize: 11,
    color: '#5BAD4E',
    fontWeight: '600',
  },
  reportBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9EE',
    borderWidth: 1,
    borderColor: '#b8ddb4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  reportBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2d6b27',
  },
  followUpRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  followUpChip: {
    backgroundColor: '#F0F9EE',
    borderWidth: 1,
    borderColor: '#D4EBD0',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  followUpText: {
    fontSize: 11,
    color: '#2d5a27',
    fontWeight: '600',
  },
  thinkingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thinkingText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  cursor: {
    color: '#5BAD4E',
    fontWeight: '700',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#D4EBD0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#F8FAFC',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#5BAD4E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#D4EBD0',
  },
});
