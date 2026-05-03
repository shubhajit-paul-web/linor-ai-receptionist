/**
 * config.js
 * Parses widget configuration from:
 *   1. window.__AI_WIDGET_CONFIG__ (dev mode / programmatic init)
 *   2. data-* attributes on the <script> tag (production embed)
 *
 * All keys are optional except apiKey and apiUrl.
 */

export const DEFAULTS = {
  botName: 'Assistant',
  primaryColor: '#6366f1',
  welcomeMessage: 'Hi! How can I help you today?',
  position: 'bottom-right',
  avatarUrl: null,
  apiKey: null,
  apiUrl: null,
  sessionTtlHours: 24,
  maxRetries: 3,
  requestTimeoutMs: 30000,
};

/**
 * Convert a hex color string to "r, g, b" triplet for use in rgba().
 * Falls back to indigo if the input is malformed.
 * @param {string} hex
 * @returns {string} e.g. "99, 102, 241"
 */
export function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  if (!result) return '99, 102, 241';
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ].join(', ');
}

/**
 * Parse and validate configuration.
 * @param {HTMLScriptElement|null} scriptEl — the <script> tag that loaded the widget
 * @returns {object} Merged and validated config
 */
export function parseConfig(scriptEl) {
  // 1. Try window.__AI_WIDGET_CONFIG__ (dev mode or programmatic embedding)
  const windowCfg =
    typeof window !== 'undefined' && window.__AI_WIDGET_CONFIG__
      ? window.__AI_WIDGET_CONFIG__
      : {};

  // 2. Parse data-* attributes from the script element (production CDN embed)
  const attrCfg = {};
  if (scriptEl) {
    const get = (attr) => scriptEl.getAttribute(`data-${attr}`);

    if (get('api-key'))         attrCfg.apiKey            = get('api-key');
    if (get('api-url'))         attrCfg.apiUrl             = get('api-url');
    if (get('bot-name'))        attrCfg.botName            = get('bot-name');
    if (get('primary-color'))   attrCfg.primaryColor       = get('primary-color');
    if (get('welcome-message')) attrCfg.welcomeMessage     = get('welcome-message');
    if (get('position'))        attrCfg.position           = get('position');
    if (get('avatar-url'))      attrCfg.avatarUrl          = get('avatar-url');
    if (get('session-ttl-hours')) {
      const v = parseInt(get('session-ttl-hours'), 10);
      if (!isNaN(v)) attrCfg.sessionTtlHours = v;
    }
    if (get('max-retries')) {
      const v = parseInt(get('max-retries'), 10);
      if (!isNaN(v)) attrCfg.maxRetries = v;
    }
    if (get('request-timeout-ms')) {
      const v = parseInt(get('request-timeout-ms'), 10);
      if (!isNaN(v)) attrCfg.requestTimeoutMs = v;
    }
  }

  // Merge: defaults < window config < script attributes
  const config = { ...DEFAULTS, ...windowCfg, ...attrCfg };

  // Compute derived values
  config.primaryRgb = hexToRgb(config.primaryColor);

  // Validation warnings
  if (!config.apiKey) {
    console.warn('[AI Widget] Missing data-api-key. Widget will be disabled.');
  }
  if (!config.apiUrl) {
    console.warn('[AI Widget] Missing data-api-url. Widget will be disabled.');
  }

  return config;
}
