/**
 * chat.js
 * Sends a chat message to the configured REST API endpoint.
 *
 * Request format (POST):
 * {
 *   message:   string                      — current user message text
 *   sessionId: string                      — for backend session tracking (camelCase)
 *   history:   [{ role, content }, ...]    — prior conversation turns (excluding current)
 * }
 *
 * Expected response format (any of):
 * { reply: string }
 * { message: string }
 * { content: string }
 *
 * Both 'x-api-key' and 'Authorization: Bearer <apiKey>' headers are sent.
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
    // Split the conversation into the current user message and prior history.
    // The backend expects: { message: string, sessionId, history: [] }
    const lastMessage = messages[messages.length - 1];
    const history = messages
      .slice(0, -1)
      .map(({ role, content }) => ({ role, content }));

    const response = await fetchWithTimeout(
      apiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Send the key via both headers so the backend accepts it regardless
          // of which header it is configured to read (x-api-key is the primary
          // backend convention; Authorization: Bearer is the widget convention).
          'x-api-key': apiKey,
          'Authorization': `Bearer ${apiKey}`,
          'X-Widget-Session': sessionId || '',
          'X-Widget-Version': '1.0.0',
        },
        body: JSON.stringify({
          message: lastMessage.content,
          sessionId,
          history,
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
