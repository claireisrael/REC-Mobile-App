import AsyncStorage from '@react-native-async-storage/async-storage';

import { createMessageId } from '@/lib/recbrain-content';

const SESSION_KEY = 'rec_chat_session_id';

export async function getChatSessionId() {
  const existing = await AsyncStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const nextId = createMessageId();
  await AsyncStorage.setItem(SESSION_KEY, nextId);
  return nextId;
}

export async function resetChatSessionId() {
  const nextId = createMessageId();
  await AsyncStorage.setItem(SESSION_KEY, nextId);
  return nextId;
}
