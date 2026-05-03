/**
 * input.js
 * Message input area at the bottom of the chat window.
 *
 * Features:
 *  - Auto-resizing textarea (expands up to 4 lines, then scrolls)
 *  - Enter to send, Shift+Enter for newline
 *  - Disabled while status === 'loading'
 *  - Emits 'send' on the event bus with trimmed text
 *  - Clears after send
 *  - "Powered by AI Receptionist" attribution footer
 */

import { h } from '../../utils/dom.js';
import { ICON_SEND } from '../../utils/icons.js';

/**
 * @param {object} store  — reactive state store
 * @param {object} bus    — event bus
 * @param {object} config — widget config (botName)
 * @returns {{ el: HTMLElement, focus: Function, destroy: Function }}
 */
export function createInput(store, bus, config) {
  // ── Textarea ──────────────────────────────────────────────────────────────

  const textarea = document.createElement('textarea');
  textarea.className = 'input-textarea';
  textarea.placeholder = `Message ${config.botName}…`;
  textarea.setAttribute('aria-label', `Type a message`);
  textarea.setAttribute('rows', '1');
  textarea.setAttribute('maxlength', '2000');
  textarea.setAttribute('autocomplete', 'off');
  textarea.setAttribute('spellcheck', 'true');

  // ── Send button ───────────────────────────────────────────────────────────

  const sendBtn = h('button', {
    class: 'send-btn',
    type: 'button',
    'aria-label': 'Send message',
    html: ICON_SEND,
    disabled: '',
  });

  // ── Input wrapper ─────────────────────────────────────────────────────────

  const inputWrapper = h('div', { class: 'input-wrapper' }, textarea);

  // ── Footer ────────────────────────────────────────────────────────────────

  const footer = h(
    'div',
    { class: 'input-footer' },
    h('span', { class: 'input-footer__text' }, 'Powered by AI Receptionist')
  );

  // ── Root ──────────────────────────────────────────────────────────────────

  const el = h(
    'div',
    { class: 'input-area', role: 'form', 'aria-label': 'Message input' },
    inputWrapper,
    sendBtn
  );

  // Container: stacks input row + footer as a flex-column unit
  const wrapper = h('div', { class: 'input-container' }, el, footer);

  // ── Auto-resize textarea ──────────────────────────────────────────────────

  function autoResize() {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  textarea.addEventListener('input', () => {
    autoResize();
    updateSendBtn();
  });

  function updateSendBtn() {
    const hasText = textarea.value.trim().length > 0;
    sendBtn.disabled = !hasText || isDisabled();
  }

  // ── Submit logic ──────────────────────────────────────────────────────────

  function submit() {
    const text = textarea.value.trim();
    if (!text || isDisabled()) return;

    bus.emit('send', text);
    textarea.value = '';
    textarea.style.height = 'auto';
    sendBtn.disabled = true;
    textarea.focus();
  }

  sendBtn.addEventListener('click', submit);

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  function isDisabled() {
    return store.getState().status === 'loading';
  }

  function setDisabled(disabled) {
    textarea.disabled = disabled;
    inputWrapper.classList.toggle('is-disabled', disabled);
    if (disabled) {
      sendBtn.disabled = true;
    } else {
      updateSendBtn();
    }
  }

  // ── State sync ────────────────────────────────────────────────────────────

  function update(state, prev) {
    if (state.status !== prev?.status) {
      setDisabled(state.status === 'loading');
    }
  }

  const unsubscribe = store.subscribe(update);

  // ── Focus utility (called by widget.js when window opens) ──────────────────

  function focus() {
    requestAnimationFrame(() => textarea.focus());
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────

  function destroy() {
    unsubscribe();
  }

  return { el: wrapper, focus, destroy };
}
