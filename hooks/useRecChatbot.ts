import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { config } from '@/lib/config';
import {
  createMessageId,
  type ChatMessage,
  WELCOME_MESSAGE,
} from '@/lib/recbrain-content';
import { getChatSessionId, resetChatSessionId } from '@/lib/recbrain-session';

type HistoryDocument = {
  $id?: string;
  role: 'user' | 'assistant';
  content: string;
};

export function useRecChatbot(enabled: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [connected, setConnected] = useState(false);
  const sessionIdRef = useRef('');
  const sourcesRef = useRef<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const loadHistory = useCallback(async () => {
    const socket = socketRef.current;
    if (!socket || !sessionIdRef.current) return;
    socket.emit('chat:history', { sessionId: sessionIdRef.current });
  }, []);

  useEffect(() => {
    if (!enabled || !config.recbrainSocketUrl) return undefined;

    let active = true;

    const connect = async () => {
      sessionIdRef.current = await getChatSessionId();
      const socket = io(config.recbrainSocketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        if (!active) return;
        setConnected(true);
        socket.emit('chat:history', { sessionId: sessionIdRef.current });
      });

      socket.on('disconnect', () => {
        if (!active) return;
        setConnected(false);
      });

      socket.on('chat:history:response', ({ history }: { history?: HistoryDocument[] }) => {
        if (!active || !history?.length) return;
        const loaded = history.map((entry) => ({
          id: entry.$id || createMessageId(),
          role: entry.role,
          content: entry.content,
          sources: [],
          showFollowUps: entry.role === 'assistant',
        }));
        setMessages([WELCOME_MESSAGE, ...loaded]);
      });

      socket.on('chat:response', (data: { type: string; token?: string; sources?: string[]; message?: string }) => {
        if (!active) return;

        if (data.type === 'thinking') {
          setThinking(true);
          setStreaming('');
          sourcesRef.current = [];
          return;
        }

        if (data.type === 'token' && data.token) {
          setThinking(false);
          setIsStreaming(true);
          setStreaming((prev) => prev + data.token);
          return;
        }

        if (data.type === 'sources' && data.sources) {
          sourcesRef.current = data.sources;
          return;
        }

        if (data.type === 'done') {
          setThinking(false);
          setIsStreaming(false);
          setStreaming((prev) => {
            if (prev) {
              const finalSources = [...sourcesRef.current];
              setMessages((current) => [
                ...current,
                {
                  id: createMessageId(),
                  role: 'assistant',
                  content: prev,
                  sources: finalSources,
                  showFollowUps: true,
                },
              ]);
            }
            return '';
          });
          sourcesRef.current = [];
          return;
        }

        if (data.type === 'error') {
          setThinking(false);
          setIsStreaming(false);
          setStreaming('');
          setMessages((current) => [
            ...current,
            {
              id: createMessageId(),
              role: 'assistant',
              content: data.message || 'Something went wrong. Please try again.',
              sources: [],
              showFollowUps: false,
            },
          ]);
        }
      });
    };

    void connect();

    return () => {
      active = false;
      socketRef.current?.removeAllListeners();
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [enabled]);

  const sendMessage = useCallback(
    (text: string) => {
      const question = text.trim();
      const socket = socketRef.current;
      if (!question || !socket || thinking || isStreaming) return;

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

      socket.emit('chat:message', {
        question,
        sessionId: sessionIdRef.current,
      });
    },
    [isStreaming, thinking]
  );

  const clearChat = useCallback(async () => {
    sessionIdRef.current = await resetChatSessionId();
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
    reloadHistory: loadHistory,
  };
}
