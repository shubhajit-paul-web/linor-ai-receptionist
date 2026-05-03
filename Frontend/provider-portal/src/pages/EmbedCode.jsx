import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle, ExternalLink, ChevronDown, ChevronUp, Info, Zap, Code2, Palette } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useClinicStore from '../store/useClinicStore';
import { CopyButton } from '../components/shared/CopyButton';
import { ConfirmModal } from '../components/shared/ConfirmModal';
import { useToast } from '../components/shared/Toast';
import { maskApiKey, cn } from '../lib/utils';

// Widget CDN URL (update to production URL when deploying)
const CDN_URL = import.meta.env.VITE_WIDGET_CDN_URL || 'https://cdn.linor.ai/widget.js';

// Chat API endpoint the widget should POST messages to
const WIDGET_API_URL = import.meta.env.VITE_CHAT_API_URL || 'https://api.linor.ai/v1/chat';

// ─── Skeleton Components ─────────────────────────────────────────────────────

function SkeletonBlock({ className }) {
  return <div className={cn('skeleton rounded-lg', className)} />;
}

function SkeletonStepCard() {
  return (
    <div className="bg-surface border border-border rounded-md p-5 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-7 h-7 rounded-full flex-shrink-0" />
        <SkeletonBlock className="h-5 w-40" />
      </div>
      <SkeletonBlock className="h-12 w-full" />
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-3 w-56" />
      </div>
    </div>
  );
}

function SkeletonSnippetCard() {
  return (
    <div className="bg-surface border border-border rounded-md p-5 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-7 h-7 rounded-full flex-shrink-0" />
        <SkeletonBlock className="h-5 w-48" />
      </div>
      <div className="flex gap-1 border-b border-border pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-8 w-20 rounded-md" />
        ))}
      </div>
      <SkeletonBlock className="h-40 w-full rounded-md" />
    </div>
  );
}

function SkeletonTestCard() {
  return (
    <div className="bg-surface border border-border rounded-md p-5 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-7 h-7 rounded-full flex-shrink-0" />
        <SkeletonBlock className="h-5 w-24" />
      </div>
      <div className="flex gap-2">
        <SkeletonBlock className="h-10 w-full rounded-md" />
        <SkeletonBlock className="h-10 w-28 rounded-md flex-shrink-0" />
      </div>
      <SkeletonBlock className="h-4 w-40" />
    </div>
  );
}

function SkeletonVerifyCard() {
  return (
    <div className="bg-surface border border-border rounded-md p-5 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-7 h-7 rounded-full flex-shrink-0" />
        <SkeletonBlock className="h-5 w-40" />
      </div>
      <SkeletonBlock className="h-24 w-full rounded-md" />
    </div>
  );
}

function SkeletonFaqCard() {
  return (
    <div className="bg-surface border border-border rounded-md p-5 space-y-3">
      <SkeletonBlock className="h-5 w-48 mb-4" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-b border-border last:border-0 pb-3 last:pb-0">
          <div className="flex items-center justify-between py-1">
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-4 w-4 rounded-sm flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Code Snippet Templates ──────────────────────────────────────────────────

// The widget reads window.LinorConfig and data-* attributes.
// data-* attributes have higher priority, window.LinorConfig is for platforms
// that don't support script attributes (WordPress php, Webflow custom code, etc.)

const SNIPPET_TEMPLATES = {
  HTML: (apiKey, apiUrl) =>
`<!-- Linor AI Receptionist: paste before the closing body tag on every page. -->
<script
  src="${CDN_URL}"
  data-api-key="${apiKey}"
  data-api-url="${apiUrl}"
  data-bot-name="Aria"
  data-primary-color="#6366f1"
  data-position="bottom-right"
  async
></script>`,

  WordPress: (apiKey, apiUrl) =>
`<?php
// Add to your theme's functions.php
function linor_chatbot_script() { ?>
  <script>
    window.LinorConfig = {
      apiKey:  "<?php echo esc_attr( '${apiKey}' ); ?>",
      apiUrl:  "${apiUrl}",
      botName: "Aria",
      position: "bottom-right"
    };
  </script>
  <script src="${CDN_URL}" async defer></script>
<?php }
add_action( 'wp_footer', 'linor_chatbot_script' );`,

  Webflow: (apiKey, apiUrl) =>
`<!-- Site Settings > Custom Code > Footer Code section -->
<script>
  window.LinorConfig = {
    apiKey:  "${apiKey}",
    apiUrl:  "${apiUrl}",
    botName: "Aria",
    position: "bottom-right"
  };
</script>
<script src="${CDN_URL}" async defer></script>`,

  Shopify: (apiKey, apiUrl) =>
`{% comment %} theme.liquid — before </body> {% endcomment %}
<script>
  window.LinorConfig = {
    apiKey:  "${apiKey}",
    apiUrl:  "${apiUrl}",
    botName: "Aria",
    position: "bottom-right"
  };
</script>
<script src="${CDN_URL}" async defer></script>`,
};

// ─── Advanced Customization Reference ────────────────────────────────────────

const ADVANCED_SNIPPET = (apiKey, apiUrl) =>
`<!-- All available options with defaults shown -->
<script
  src="${CDN_URL}"
  data-api-key="${apiKey}"
  data-api-url="${apiUrl}"

  data-bot-name="Aria"
  data-primary-color="#6366f1"
  data-welcome-message="Hi! How can I help you today?"
  data-avatar-url=""

  data-position="bottom-right"
  data-offset-x="24"
  data-offset-y="24"
  data-button-size="56"
  data-window-width="380"
  data-window-height="580"
  data-z-index="2147483647"
  data-hide-attribution="false"

  data-session-ttl-hours="24"
  data-max-retries="3"
  data-request-timeout-ms="30000"
  async
></script>`;

// ─── Public API Reference ────────────────────────────────────────────────────

const JS_API_SNIPPET = () =>
`// After the script loads, window.LinorWidget is available:

// Open / close programmatically
window.LinorWidget.open();
window.LinorWidget.close();
window.LinorWidget.toggle();

// Listen to internal events
window.LinorWidget.on('toggle', () => console.log('toggled'));
window.LinorWidget.on('send',   (text) => console.log('user sent:', text));

// Remove the widget from the page entirely
window.LinorWidget.destroy();

// Check current state
const { isOpen, unreadCount, messages } = window.LinorWidget.getState();`;

const FAQ_ITEMS = [
  { q: 'Does it slow down my website?', a: 'No — the script loads with the async attribute and has zero impact on page load or Core Web Vitals.' },
  { q: 'Will it work on multiple pages?', a: 'Yes. Paste the snippet once in your site template (footer/header) and it appears on every page automatically.' },
  { q: 'Can I change colors or position after deploying?', a: 'Yes — update the data-primary-color or data-position attribute and redeploy. Changes take effect immediately on page load.' },
  { q: 'How do I remove it?', a: 'Delete the <script> tag from your HTML, or call window.LinorWidget.destroy() at runtime. The widget disappears immediately.' },
  { q: 'Is the widget isolated from my page styles?', a: 'Yes — it uses Shadow DOM for complete CSS isolation. Your page\'s styles cannot affect it, and vice versa.' },
  { q: 'What if my site has a strict Content Security Policy?', a: "Add the CDN domain to your script-src CSP directive: script-src 'self' cdn.linor.ai" },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors"
      >
        <span className="text-sm font-medium text-text-primary">{q}</span>
        {open ? <ChevronUp size={16} className="text-text-muted flex-shrink-0" /> : <ChevronDown size={16} className="text-text-muted flex-shrink-0" />}
      </button>
      {open && <p className="text-sm text-text-secondary pb-4 leading-relaxed">{a}</p>}
    </div>
  );
}

// ─── Step Badge ──────────────────────────────────────────────────────────────

function StepBadge({ n }) {
  return (
    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-on text-xs font-bold flex-shrink-0">
      {n}
    </div>
  );
}

// ─── Code Block ───────────────────────────────────────────────────────────────

function CodeBlock({ code, lang = 'html' }) {
  return (
    <div className="relative code-block rounded-md">
      <div className="absolute top-3 right-3 z-10">
        <CopyButton text={code} />
      </div>
      <pre className="text-sm overflow-x-auto pr-16 whitespace-pre-wrap leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Embed Code Page ──────────────────────────────────────────────────────────

const SNIPPET_TABS = ['HTML', 'WordPress', 'Webflow', 'Shopify'];
const ADVANCED_TABS = ['All Options', 'JS API'];

export default function EmbedCode() {
  const authStore = useAuthStore();
  const { regenerateApiKeyOnApi } = useClinicStore();
  const toast = useToast();

  const [apiKey, setApiKey] = useState(authStore.getApiKey());
  const [revealed, setRevealed] = useState(false);
  const [regenOpen, setRegenOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('HTML');
  const [advancedTab, setAdvancedTab] = useState('All Options');
  const [testUrl, setTestUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Simulate async data fetch
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1300);
    return () => clearTimeout(t);
  }, []);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const newApiKey = await regenerateApiKeyOnApi();
      if (newApiKey) {
        setApiKey(newApiKey);
        setRegenOpen(false);
        setRevealed(false);
        toast.success('API key regenerated. Update your embed snippet.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to regenerate API key');
    } finally {
      setIsRegenerating(false);
    }
  };

  const openSandbox = useCallback(() => {
    // Build a sandbox URL with the current config baked in via query params
    // so the demo page can boot the widget without needing a real backend
    const params = new URLSearchParams({
      apiKey,
      apiUrl: WIDGET_API_URL,
      botName: 'Aria',
      primaryColor: '#6366f1',
    });
    const sandboxUrl = `${CDN_URL.replace('/widget.js', '/demo')}?${params}`;
    // Fallback: open the widget demo index.html if a CDN demo path isn't hosted yet
    window.open(sandboxUrl, '_blank', 'noopener,noreferrer');
  }, [apiKey]);

  const snippet = SNIPPET_TEMPLATES[activeTab]?.(apiKey, WIDGET_API_URL) ?? '';
  const advancedSnippet = advancedTab === 'All Options'
    ? ADVANCED_SNIPPET(apiKey, WIDGET_API_URL)
    : JS_API_SNIPPET();

  const connected = true;

  return (
    <div className="max-w-3xl space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-h2 text-text-primary">Embed Your Chatbot</h1>
        <p className="text-sm text-text-muted mt-1">
          One script tag is all it takes. Paste it before{' '}
          <code className="mono text-xs bg-surface-secondary px-1 rounded">&lt;/body&gt;</code>{' '}
          and your widget goes live instantly.
        </p>
      </div>

      {/* ── Step 1: API Key ────────────────────────────────────── */}
      {isLoading ? <SkeletonStepCard /> : (
        <div className="bg-surface border border-border rounded-md p-5">
          <div className="flex items-center gap-3 mb-4">
            <StepBadge n={1} />
            <h2 className="text-h4 text-text-primary">Your API Key</h2>
          </div>
          <div className="bg-surface-secondary border border-border rounded-md p-4 flex items-center gap-3">
            <code className="mono flex-1 text-text-primary truncate text-sm">
              {revealed ? apiKey : maskApiKey(apiKey)}
            </code>
            <button
              onClick={() => setRevealed((v) => !v)}
              className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
              aria-label={revealed ? 'Hide API key' : 'Reveal API key'}
            >
              {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <CopyButton text={apiKey} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
            <button
              onClick={() => setRegenOpen(true)}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 text-xs text-danger hover:underline transition-colors disabled:opacity-60"
            >
              <RefreshCw size={13} className={isRegenerating ? 'animate-spin' : ''} />
              {isRegenerating ? 'Regenerating…' : 'Regenerate Key'}
            </button>
            <span className="text-text-muted text-xs">·</span>
            <span className="text-xs text-text-muted">
              Keep this private — never commit it to public repos.
            </span>
          </div>
        </div>
      )}

      {/* ── Step 2: Embed Snippet ──────────────────────────────── */}
      {isLoading ? <SkeletonSnippetCard /> : (
        <div className="bg-surface border border-border rounded-md p-5">
          <div className="flex items-center gap-3 mb-1">
            <StepBadge n={2} />
            <h2 className="text-h4 text-text-primary">Copy the Embed Snippet</h2>
          </div>
          <p className="text-xs text-text-muted mb-4 ml-10">
            Pick your platform. The snippet includes your live API key and endpoint.
          </p>

          {/* Platform tabs */}
          <div className="flex gap-1 border-b border-border mb-4 overflow-x-auto">
            {SNIPPET_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <CodeBlock code={snippet} />

          {/* Quick tips below snippet */}
          <div className="mt-3 flex items-start gap-2 p-3 bg-surface-secondary rounded-md border border-border">
            <Info size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
            <p className="text-xs text-text-muted leading-relaxed">
              {activeTab === 'HTML' && 'Paste right before </body>. The async attribute ensures zero impact on page load speed.'}
              {activeTab === 'WordPress' && 'Add this to your active theme\'s functions.php, or use a code snippet plugin like WPCode.'}
              {activeTab === 'Webflow' && 'Go to Project Settings → Custom Code → Footer Code and paste there.'}
              {activeTab === 'Shopify' && 'Edit your theme.liquid file and paste before </body>. Works on all Shopify themes.'}
            </p>
          </div>
        </div>
      )}

      {/* ── Step 3: Test ──────────────────────────────────────── */}
      {isLoading ? <SkeletonTestCard /> : (
        <div className="bg-surface border border-border rounded-md p-5">
          <div className="flex items-center gap-3 mb-4">
            <StepBadge n={3} />
            <h2 className="text-h4 text-text-primary">Test It</h2>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="flex-1 h-10 px-3 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary"
            />
            <button
              disabled={!testUrl.trim()}
              onClick={() => {
                const url = testUrl.trim();
                if (url) window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="h-10 px-4 text-sm font-medium bg-primary text-primary-on rounded-md hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <ExternalLink size={15} />
              Open
            </button>
          </div>
          <button
            onClick={openSandbox}
            className="text-sm text-primary hover:underline flex items-center gap-1.5"
          >
            <Zap size={13} />
            Test on a sandbox page →
          </button>
        </div>
      )}

      {/* ── Step 4: Verify ────────────────────────────────────── */}
      {isLoading ? <SkeletonVerifyCard /> : (
        <div className="bg-surface border border-border rounded-md p-5">
          <div className="flex items-center gap-3 mb-4">
            <StepBadge n={4} />
            <h2 className="text-h4 text-text-primary">Verify Connection</h2>
          </div>
          <div className={cn(
            'flex items-start gap-3 p-4 rounded-md border',
            connected ? 'bg-success-light border-success/20' : 'bg-warning-light border-warning/20'
          )}>
            {connected ? (
              <CheckCircle size={18} className="text-success flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="text-warning flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={cn('text-sm font-semibold', connected ? 'text-success' : 'text-warning')}>
                {connected ? 'Connected — last activity: 2 hours ago' : 'Waiting for first message'}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {connected
                  ? 'Your chatbot is live and receiving requests.'
                  : 'Make sure the script tag is pasted correctly and the page has been reloaded.'}
              </p>
              <a href="/logs" className="text-xs text-primary hover:underline mt-1 inline-block">
                View in Chat Logs →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Advanced Customization (collapsible) ──────────────── */}
      {!isLoading && (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-surface-secondary border border-border flex items-center justify-center flex-shrink-0">
                <Palette size={14} className="text-text-muted" />
              </div>
              <div>
                <h2 className="text-h4 text-text-primary">Advanced Customization</h2>
                <p className="text-xs text-text-muted mt-0.5">All options, positions, colors, and the JavaScript API</p>
              </div>
            </div>
            {showAdvanced
              ? <ChevronUp size={16} className="text-text-muted flex-shrink-0" />
              : <ChevronDown size={16} className="text-text-muted flex-shrink-0" />}
          </button>

          {showAdvanced && (
            <div className="px-5 pb-5 space-y-4 border-t border-border">
              {/* Sub-tabs */}
              <div className="flex gap-1 border-b border-border pt-4">
                {ADVANCED_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAdvancedTab(tab)}
                    className={cn(
                      'px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5',
                      advancedTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-text-muted hover:text-text-primary'
                    )}
                  >
                    {tab === 'JS API' && <Code2 size={11} />}
                    {tab}
                  </button>
                ))}
              </div>

              {advancedTab === 'All Options' && (
                <>
                  <p className="text-xs text-text-muted">
                    Every <code className="mono bg-surface-secondary px-1 rounded">data-*</code> attribute the widget accepts.
                    All are optional — only <code className="mono bg-surface-secondary px-1 rounded">data-api-key</code> and{' '}
                    <code className="mono bg-surface-secondary px-1 rounded">data-api-url</code> are required.
                  </p>
                  <CodeBlock code={advancedSnippet} />
                  {/* Position quick-reference */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['bottom-right', 'bottom-left', 'top-right', 'top-left'].map((pos) => (
                      <div key={pos} className="flex items-center gap-2 p-2 bg-surface-secondary rounded border border-border">
                        <span className="font-mono text-primary">{pos}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-text-muted">↑ Valid values for <code className="mono bg-surface-secondary px-1 rounded">data-position</code></p>
                </>
              )}

              {advancedTab === 'JS API' && (
                <>
                  <p className="text-xs text-text-muted">
                    After the script loads, <code className="mono bg-surface-secondary px-1 rounded">window.LinorWidget</code>{' '}
                    is available for programmatic control.
                  </p>
                  <CodeBlock code={advancedSnippet} />
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── FAQ Accordion ─────────────────────────────────────── */}
      {isLoading ? <SkeletonFaqCard /> : (
        <div className="bg-surface border border-border rounded-md p-5">
          <h3 className="text-h4 text-text-primary mb-2">Common Questions</h3>
          {FAQ_ITEMS.map((item) => <FaqItem key={item.q} {...item} />)}
        </div>
      )}

      {/* Regenerate Key Modal */}
      <ConfirmModal
        open={regenOpen}
        onClose={() => !isRegenerating && setRegenOpen(false)}
        onConfirm={handleRegenerate}
        title="Regenerate API Key?"
        description="This will invalidate your current key immediately. Any website using the old key will stop working until you update the embed snippet with the new key."
        confirmLabel={isRegenerating ? 'Regenerating…' : 'Yes, Regenerate'}
        confirmDanger
        disabled={isRegenerating}
      />
    </div>
  );
}
