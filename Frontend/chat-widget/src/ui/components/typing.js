/**
 * typing.js
 * Animated typing indicator (three bouncing dots) shown while the
 * assistant is generating a response (status === 'loading').
 *
 * The element stays in the DOM at all times; it's shown/hidden by
 * toggling the `hidden` attribute to avoid layout thrashing.
 */

import { h } from '../../utils/dom.js';
import { getInitials } from '../../utils/dom.js';

/**
 * @param {object} store  — reactive state store
 * @param {object} config — widget config (botName, avatarUrl)
 * @returns {{ el: HTMLElement, destroy: Function }}
 */
export function createTypingIndicator(store, config) {
  // ── Bot mini-avatar beside the dots ──────────────────────────────────────

  let avatarEl;
  if (config.avatarUrl) {
    avatarEl = h('div', { class: 'bubble-avatar' });
    const img = document.createElement('img');
    img.src = config.avatarUrl;
    img.alt = '';
    img.addEventListener('error', () => {
      img.replaceWith(document.createTextNode(getInitials(config.botName)));
    });
    avatarEl.appendChild(img);
  } else {
    avatarEl = h(
      'div',
      { class: 'bubble-avatar', 'aria-hidden': 'true' },
      getInitials(config.botName)
    );
  }

  // ── Dots ──────────────────────────────────────────────────────────────────

  const dotsEl = h(
    'div',
    { class: 'typing-bubble', 'aria-hidden': 'true' },
    h('span', { class: 'typing-dot' }),
    h('span', { class: 'typing-dot' }),
    h('span', { class: 'typing-dot' })
  );

  // ── Root ──────────────────────────────────────────────────────────────────

  const el = h(
    'div',
    {
      class: 'typing-indicator',
      role: 'status',
      'aria-label': `${config.botName} is typing`,
    },
    avatarEl,
    dotsEl
  );

  el.setAttribute('hidden', '');

  // ── State sync ─────────────────────────────────────────────────────────────

  function update(state, prev) {
    if (state.status === prev?.status) return;

    const isLoading = state.status === 'loading';
    if (isLoading) {
      el.removeAttribute('hidden');
    } else {
      el.setAttribute('hidden', '');
    }
  }

  const unsubscribe = store.subscribe(update);

  function destroy() {
    unsubscribe();
  }

  return { el, destroy };
}
