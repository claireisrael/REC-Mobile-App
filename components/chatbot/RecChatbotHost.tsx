import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RecChatbotFab } from '@/components/chatbot/RecChatbotFab';
import { RecChatbotModal } from '@/components/chatbot/RecChatbotModal';
import { useRecChatbot } from '@/hooks/useRecChatbot';
import { isRecbrainConfigured } from '@/lib/config';

const TAB_BAR_OFFSET = 72;

export function RecChatbotHost() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const enabled = isRecbrainConfigured();
  const chat = useRecChatbot(enabled);

  if (!enabled) return null;

  return (
    <View pointerEvents="box-none" style={styles.host}>
      <View
        pointerEvents="box-none"
        style={[styles.fabPosition, { bottom: insets.bottom + TAB_BAR_OFFSET }]}
      >
        <RecChatbotFab visible={!open} onPress={() => setOpen(true)} />
      </View>

      <RecChatbotModal
        visible={open}
        connected={chat.connected}
        messages={chat.messages}
        thinking={chat.thinking}
        streaming={chat.streaming}
        isStreaming={chat.isStreaming}
        onClose={() => setOpen(false)}
        onSend={chat.sendMessage}
        onClear={chat.clearChat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  fabPosition: {
    position: 'absolute',
    right: 0,
    left: 0,
    alignItems: 'flex-end',
    paddingRight: 16,
  },
});
