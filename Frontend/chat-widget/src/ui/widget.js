/**
 * widget.js
 * Root component and application orchestrator.
 *
 * Responsibilities:
 *  1. Inject all styles into the Shadow DOM
 *  2. Create and mount all UI components
 *  3. Initialize the reactive store and session
 *  4. Wire event bus → store mutations → API calls
 *  5. Handle focus management (trap, restore) and Escape key
 *  6. Manage the unread badge counter
 *  7. Persist session on every state change
 *
 * This is the single place where business logic lives.
 * All components are dumb — they render state and emit events.
 */

import { createStore, createInitialState } from '../features/store.js';
import { createSession } from '../features/session.js';
import { sendMessage } from '../api/chat.js';
import { classifyError } from '../api/client.js';
import { createEventBus } from '../utils/events.js';
import { generateId } from '../utils/uid.js';
import { createFocusTrap } from '../utils/a11y.js';

import { baseStyles }     from './styles/base.css.js';
import { widgetStyles }   from './styles/widget.css.js';
import { messagesStyles } from './styles/messages.css.js';
import { inputStyles }    from './styles/input.css.js';

import { createLauncher }     from './components/launcher.js';
import { createHeader }       from './components/header.js';
import { createMessages }     from './components/messages.js';
import { createInput }        from './components/input.js';
import { createErrorBanner }  from './components/error.js';

/**
 * Bootstrap the entire widget inside a Shadow DOM root.
 *
 * @param {ShadowRoot} shadow — closed shadow root created by init.js
 * @param {object}     config — parsed widget configuration
 */
export function createWidget(shadow, config) {
  // ── 1. Styles ──────────────────────────────────────────────────────────────

  const styleEl = document.createElement('style');
  styleEl.textContent = [
    baseStyles(config),
    widgetStyles(),
    messagesStyles(),
    inputStyles(),
  ].join('\n');
  shadow.appendChild(styleEl);

  // ── 2. Session ─────────────────────────────────────────────────────────────

  const session = createSession(config.apiKey, config.sessionTtlHours);
  const persisted = session.load();
  const sessionId = persisted?.sessionId ?? session.createNew();
  const persistedMessages = persisted?.messages ?? [];

  // Attach sessionId to config so API calls can include it
  config.sessionId = sessionId;

  // ── 3. Store ──────────────────────────────────────────────────────────────

  const store = createStore(
    createInitialState(sessionId, persistedMessages)
  );

  // Persist on every state change (debounced)
  let persistTimer = null;
  store.subscribe((state) => {
    clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      session.save(state.sessionId, state.messages);
    }, 300);
  });

  // ── 4. Event bus ──────────────────────────────────────────────────────────

  const bus = createEventBus();

  // ── 5. Create components ───────────────────────────────────────────────────

  const { el: launcherEl } = createLauncher(store, bus, config);

  const { el: headerEl } = createHeader(bus, config);

  const { el: messagesEl, scrollToBottom } = createMessages(store, bus, config);

  const { el: errorEl } = createErrorBanner(store, bus);

  const { el: inputEl, focus: focusInput } = createInput(store, bus, config);

  // ── 6. Assemble chat window ────────────────────────────────────────────────

  const chatWindow = document.createElement('div');
  chatWindow.className = 'widget-window';
  chatWindow.setAttribute('role', 'dialog');
  chatWindow.setAttribute('aria-modal', 'true');
  chatWindow.setAttribute('aria-label', `Chat with ${config.botName}`);
  chatWindow.setAttribute('aria-hidden', 'true');

  chatWindow.appendChild(headerEl);
  chatWindow.appendChild(messagesEl);
  chatWindow.appendChild(errorEl);
  chatWindow.appendChild(inputEl);

  shadow.appendChild(chatWindow);
  shadow.appendChild(launcherEl);

  // ── 7. Focus management ────────────────────────────────────────────────────

  const focusTrap = createFocusTrap(chatWindow);
  let launcherFocusRef = launcherEl; // restore focus here on close

  // ── 8. Event bus handlers ──────────────────────────────────────────────────

  bus.on('toggle', () => {
    const { isOpen } = store.getState();
    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  });

  bus.on('close', () => {
    closeWidget();
  });

  bus.on('send', (text) => {
    handleSend(text);
  });

  bus.on('retry-last', () => {
    const { messages } = store.getState();
    // Find the last failed user message and retry it
    const lastFailed = [...messages].reverse().find(
      (m) => m.role === 'user' && m.status === 'failed'
    );
    if (lastFailed) {
      retryMessage(lastFailed);
    }
  });

  bus.on('retry-message', ({ messageId, content }) => {
    const { messages } = store.getState();
    const msg = messages.find((m) => m.id === messageId);
    if (msg) {
      retryMessage(msg);
    }
  });

  bus.on('dismiss-error', () => {
    store.setState({ error: null });
  });

  // ── 9. Open / close ────────────────────────────────────────────────────────

  function openWidget() {
    store.setState({ isOpen: true, unreadCount: 0 });
    chatWindow.classList.add('is-open');
    chatWindow.removeAttribute('aria-hidden');
    focusTrap.activate(/* initial focus */ null);
    focusInput();
    scrollToBottom(true);

    // Announce to screen readers
    chatWindow.setAttribute('aria-label', `Chat with ${config.botName} — dialog`);
  }

  function closeWidget() {
    store.setState({ isOpen: false });
    chatWindow.classList.remove('is-open');
    chatWindow.setAttribute('aria-hidden', 'true');
    focusTrap.deactivate(launcherFocusRef);
  }

  // ── 10. Global Escape key listener ────────────────────────────────────────

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && store.getState().isOpen) {
      closeWidget();
    }
  });

  // ── 11. Send message flow ──────────────────────────────────────────────────

  async function handleSend(text) {
    const state = store.getState();
    if (state.status === 'loading') return;

    const userMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      status: 'sending',
    };

    // Optimistic update: add user message immediately
    store.setState((s) => ({
      messages: [...s.messages, userMessage],
      status: 'loading',
      error: null,
    }));

    await dispatchApiCall(userMessage);
  }

  async function retryMessage(failedMessage) {
    // Reset the failed message to 'sending'
    store.setState((s) => ({
      messages: s.messages.map((m) =>
        m.id === failedMessage.id ? { ...m, status: 'sending' } : m
      ),
      status: 'loading',
      error: null,
    }));

    await dispatchApiCall(failedMessage);
  }

  async function dispatchApiCall(userMessage) {
    // Mark user message as sent right before the API call
    store.setState((s) => ({
      messages: s.messages.map((m) =>
        m.id === userMessage.id ? { ...m, status: 'sent' } : m
      ),
    }));

    try {
      const currentMessages = store.getState().messages.filter(
        (m) => m.status !== 'failed'
      );

      const reply = await sendMessage(currentMessages, config);

      const assistantMessage = {
        id: generateId(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
        status: 'sent',
      };

      store.setState((s) => ({
        messages: [...s.messages, assistantMessage],
        status: 'idle',
        error: null,
      }));

      // Increment unread count if window is closed
      if (!store.getState().isOpen) {
        store.setState((s) => ({ unreadCount: s.unreadCount + 1 }));
      }

    } catch (err) {
      const errorDetails = classifyError(err);

      // Mark the user message as failed
      store.setState((s) => ({
        messages: s.messages.map((m) =>
          m.id === userMessage.id ? { ...m, status: 'failed' } : m
        ),
        status: 'error',
        error: {
          message: errorDetails.message,
          retryable: errorDetails.retryable,
          failedMessageId: userMessage.id,
        },
      }));

      console.error('[AI Widget] API call failed:', err);
    }
  }

  // ── 12. Restore persisted open state is intentionally NOT done ─────────────
  // The widget always starts closed. Open state is not persisted
  // as it would be jarring on page reload.
}
