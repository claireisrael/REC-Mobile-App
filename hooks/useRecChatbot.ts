import { useCallback, useRef, useState } from 'react';

import { askRecChat } from '@/lib/rec-chat-api';
import {
  createMessageId,
  type ChatMessage,
  WELCOME_MESSAGE,
} from '@/lib/recbrain-content';

export function useRecChatbot(enabled: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [connected] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const busyRef = useRef(false);

  const sendMessage = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!enabled || !question || busyRef.current || thinking || isStreaming) return;

      busyRef.current = true;
      const history = messages
        .filter((message) => message.id !== 'welcome')
        .map((message) => ({ role: message.role, content: message.content }));

      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: 'user',
          content: question,
          sources: [],
          showFollowUps: false,
        },
      ]);

      setThinking(true);
      setStreaming('');
      setIsStreaming(false);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const result = await askRecChat(question, history, controller.signal);
        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: 'assistant',
            content: result.answer,
            sources: result.sources,
            showFollowUps: true,
          },
        ]);
      } catch (error) {
        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: 'assistant',
            content:
              error instanceof Error
                ? error.message
                : 'Something went wrong. Please try again.',
            sources: [],
            showFollowUps: false,
          },
        ]);
      } finally {
        busyRef.current = false;
        abortRef.current = null;
        setThinking(false);
        setIsStreaming(false);
        setStreaming('');
      }
    },
    [enabled, isStreaming, messages, thinking]
  );

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    busyRef.current = false;
    setMessages([WELCOME_MESSAGE]);
    setStreaming('');
    setThinking(false);
    setIsStreaming(false);
  }, []);

  return {
    messages,
    thinking,
    streaming,
    isStreaming,
    connected,
    sendMessage,
    clearChat,
    reloadHistory: async () => undefined,
  };
}
