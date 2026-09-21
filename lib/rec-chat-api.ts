import { config } from './config';

export type RecChatHistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

export type RecChatSource = {
  source?: string;
  title?: string;
  sourceType?: string;
  url?: string;
};

export type RecChatJsonResponse = {
  answer?: string;
  sources?: RecChatSource[];
  error?: string | { code?: string; message?: string };
  code?: string;
  requestId?: string;
};

const HISTORY_MAX_MESSAGES = 8;
const HISTORY_MAX_MESSAGE_CHARS = 1200;
const CHAT_TIMEOUT_MS = 195_000;

export function buildChatHistory(messages: RecChatHistoryItem[]): RecChatHistoryItem[] {
  return messages
    .filter((item) => item.role === 'user' || item.role === 'assistant')
    .slice(-HISTORY_MAX_MESSAGES)
    .map((item) => ({
      role: item.role,
      content: String(item.content || '').slice(0, HISTORY_MAX_MESSAGE_CHARS),
    }));
}

function formatChatError(payload: RecChatJsonResponse, status: number) {
  if (typeof payload.error === 'string' && payload.error.trim()) return payload.error;
  if (payload.error && typeof payload.error === 'object' && payload.error.message) {
    return payload.error.message;
  }
  if (status === 429) return 'Chat is busy; please retry shortly.';
  if (status === 504) return 'The answer took too long. Try a shorter question.';
  return 'Chat unavailable. Please try again.';
}

export function sourceLabels(sources: RecChatSource[] = []) {
  return sources
    .map((source) => source.title || source.source || source.sourceType || '')
    .filter(Boolean);
}

/** Non-streaming JSON reply from the public conference chatbot. */
export async function askRecChat(
  question: string,
  history: RecChatHistoryItem[] = [],
  signal?: AbortSignal
): Promise<{ answer: string; sources: string[]; requestId?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);

  try {
    const response = await fetch(`${config.chatApiUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        question,
        history: buildChatHistory(history),
        stream: false,
      }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => ({}))) as RecChatJsonResponse;

    if (!response.ok) {
      throw new Error(formatChatError(payload, response.status));
    }

    const answer = String(payload.answer || '').trim();
    if (!answer) {
      throw new Error('The chatbot returned an empty answer.');
    }

    return {
      answer,
      sources: sourceLabels(payload.sources),
      requestId: payload.requestId,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The chat request was cancelled or timed out.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', onAbort);
  }
}
