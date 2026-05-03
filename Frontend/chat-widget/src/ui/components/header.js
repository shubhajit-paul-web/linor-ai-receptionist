/**
 * header.js
 * Chat window header bar.
 *
 * Displays:
 *  - Bot avatar (image or initials fallback) with online status dot
 *  - Bot name + "Active now" subtitle
 *  - Close (chevron-down) button
 *
 * Emits 'close' when the close button is clicked.
 */

import { h, getInitials } from '../../utils/dom.js';
import { ICON_CHEVRON_DOWN } from '../../utils/icons.js';

/**
 * @param {object} bus    — internal event bus
 * @param {object} config — widget config (botName, avatarUrl)
 * @returns {{ el: HTMLElement, destroy: Function }}
 */
export function createHeader(bus, config) {
  // ── Avatar ────────────────────────────────────────────────────────────────

  let avatarEl;
  if (config.avatarUrl) {
    const img = h('img', {
      class: 'header__avatar-img',
      src: config.avatarUrl,
      alt: `${config.botName} avatar`,
    });
    img.addEventListener('error', () => {
      img.replaceWith(makeFallbackAvatar());
    });
    avatarEl = img;
  } else {
    avatarEl = makeFallbackAvatar();
  }

  function makeFallbackAvatar() {
    return h(
      'span',
      { class: 'header__avatar-fallback', 'aria-hidden': 'true' },
      getInitials(config.botName)
    );
  }

  const statusDot = h('span', {
    class: 'header__status-dot',
    title: 'Online',
    'aria-hidden': 'true',
  });

  const avatarWrapper = h('div', { class: 'header__avatar' }, avatarEl, statusDot);

  // ── Info ──────────────────────────────────────────────────────────────────

  const nameEl = h('div', { class: 'header__name' }, config.botName);
  const subtitleEl = h('div', { class: 'header__subtitle' }, 'Active now');
  const infoEl = h('div', { class: 'header__info' }, nameEl, subtitleEl);

  // ── Close button ──────────────────────────────────────────────────────────

  const closeBtn = h('button', {
    class: 'header__btn',
    type: 'button',
    'aria-label': 'Close chat',
    html: ICON_CHEVRON_DOWN,
  });

  closeBtn.addEventListener('click', () => {
    bus.emit('close');
  });

  const actionsEl = h('div', { class: 'header__actions' }, closeBtn);

  // ── Root ──────────────────────────────────────────────────────────────────

  const el = h('header', { class: 'header', role: 'banner' }, avatarWrapper, infoEl, actionsEl);

  // ── Cleanup ────────────────────────────────────────────────────────────────

  function destroy() {
    closeBtn.removeEventListener('click', () => bus.emit('close'));
  }

  return { el, destroy };
}
