/**
 * chat.js
 * Sends a chat message to the configured REST API endpoint.
 *
 * Request format (POST):
 * {
 *   messages:   [{ role, content }, ...],  — full conversation history
 *   session_id: string                     — for backend session tracking
 * }
 *
 * Expected response format (any of):
 * { reply: string }
 * { message: string }
 * { content: string }
 *
 * Authorization: Bearer <apiKey> header is always sent.
 * The backend can use session_id for context retrieval / memory.
 */

import { fetchWithTimeout, fetchWithRetry, ApiError } from './client.js';

/**
 * Send the conversation history and receive the assistant's reply.
 *
 * @param {Array<{ role: string, content: string }>} messages
 * @param {object} config — widget config (apiKey, apiUrl, sessionId, maxRetries, requestTimeoutMs)
 * @returns {Promise<string>} The assistant's reply text
 */
export async function sendMessage(messages, config) {
  const { apiKey, apiUrl, sessionId, maxRetries, requestTimeoutMs } = config;

  const call = async () => {
    const response = await fetchWithTimeout(
      apiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Widget-Session': sessionId || '',
          'X-Widget-Version': '1.0.0',
        },
        body: JSON.stringify({
          messages: messages.map(({ role, content }) => ({ role, content })),
          session_id: sessionId,
        }),
      },
      requestTimeoutMs
    );

    if (!response.ok) {
      let errorText = '';
      try {
        const body = await response.json();
        errorText = body.error || body.message || JSON.stringify(body);
      } catch {
        errorText = await response.text().catch(() => `HTTP ${response.status}`);
      }
      throw new ApiError(errorText || `HTTP ${response.status}`, response.status);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new ApiError('Invalid JSON in API response', 200);
    }

    // Support multiple common response shapes
    const reply = data.reply ?? data.message ?? data.content ?? data.text ?? data.answer;
    if (typeof reply !== 'string' || reply.trim() === '') {
      throw new ApiError('Unrecognised response format from API', 200);
    }

    return reply.trim();
  };

  return fetchWithRetry(call, maxRetries);
}
