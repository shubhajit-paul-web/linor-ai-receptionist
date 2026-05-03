import { useState } from 'react';
import { Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useClinicStore from '../store/useClinicStore';
import { CopyButton } from '../components/shared/CopyButton';
import { ConfirmModal } from '../components/shared/ConfirmModal';
import { useToast } from '../components/shared/Toast';
import { maskApiKey, cn } from '../lib/utils';

// ─── Code Snippet Templates ──────────────────────────────────────────────────

const SNIPPET_TEMPLATES = {
  HTML: (apiKey) => `<!-- Paste this before </body> on every page -->
<script>
  window.LinorConfig = {
    apiKey: "${apiKey}",
    position: "bottom-right"
  };
</script>
<script
  src="https://cdn.linor.ai/widget.js"
  async
  defer
></script>`,
  WordPress: (apiKey) => `// Add to your theme's functions.php
function linor_chatbot_script() {
  ?>
  <script>
    window.LinorConfig = { apiKey: "<?php echo '${apiKey}'; ?>" };
  </script>
  <script src="https://cdn.linor.ai/widget.js" async defer></script>
  <?php
}
add_action('wp_footer', 'linor_chatbot_script');`,
  Webflow: (apiKey) => `<!-- Go to Site Settings > Custom Code > Footer -->
<script>
  window.LinorConfig = { apiKey: "${apiKey}" };
</script>
<script src="https://cdn.linor.ai/widget.js" async defer></script>`,
  Shopify: (apiKey) => `<!-- Add to theme.liquid before </body> -->
<script>
  window.LinorConfig = { apiKey: "${apiKey}" };
</script>
<script src="https://cdn.linor.ai/widget.js" async defer></script>`,
};

const FAQ_ITEMS = [
  { q: 'Does it slow down my website?', a: 'No — the script loads asynchronously and has zero impact on page load performance.' },
  { q: 'Will it work on multiple pages?', a: 'Yes. Add the snippet once in your site template (e.g., header or footer) and it will appear on every page.' },
  { q: 'Can I test it before going live?', a: 'Yes — use the "Test on sandbox page" button below to see a live demo with your current settings.' },
  { q: 'How do I remove it later?', a: 'Simply delete the two script tags from your HTML. The widget will disappear immediately.' },
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

// ─── Embed Code Page ──────────────────────────────────────────────────────────

export default function EmbedCode() {
  const authStore = useAuthStore();
  const { regenerateApiKeyOnApi } = useClinicStore();
  const toast = useToast();

  const [apiKey, setApiKey] = useState(authStore.getApiKey());
  const [revealed, setRevealed] = useState(false);
  const [regenOpen, setRegenOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('HTML');
  const [testUrl, setTestUrl] = useState('');

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

  const snippet = SNIPPET_TEMPLATES[activeTab]?.(apiKey) ?? '';

  // Simulate connection status
  const connected = true;

  return (
    <div className="max-w-3xl space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-h2 text-text-primary">Embed Your Chatbot</h1>
        <p className="text-sm text-text-muted mt-1">
          Add 2 lines of code to your clinic's website and you're live.
        </p>
      </div>

      {/* ── Step 1: API Key ────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-md p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-on text-xs font-bold flex-shrink-0">1</div>
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
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => setRegenOpen(true)}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 text-xs text-danger hover:underline transition-colors disabled:opacity-60"
          >
            <RefreshCw size={13} className={isRegenerating ? "animate-spin" : ""} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate Key'}
          </button>
          <span className="text-text-muted">·</span>
          <span className="text-xs text-text-muted">Keep this private — never expose it in public repositories.</span>
        </div>
      </div>

      {/* ── Step 2: Embed Snippet ──────────────────────────────── */}
      <div className="bg-surface border border-border rounded-md p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-on text-xs font-bold flex-shrink-0">2</div>
          <h2 className="text-h4 text-text-primary">Copy the Embed Snippet</h2>
        </div>

        {/* Platform tabs */}
        <div className="flex gap-1 border-b border-border mb-4">
          {Object.keys(SNIPPET_TEMPLATES).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div className="relative code-block">
          <div className="absolute top-3 right-3">
            <CopyButton text={snippet} />
          </div>
          <pre className="text-sm overflow-x-auto pr-20 whitespace-pre-wrap">
            <code>{snippet}</code>
          </pre>
        </div>
      </div>

      {/* ── Step 3: Test ──────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-md p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-on text-xs font-bold flex-shrink-0">3</div>
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
            disabled={!testUrl}
            onClick={() => window.open(testUrl, '_blank')}
            className="h-10 px-4 text-sm font-medium bg-primary text-primary-on rounded-md hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            <ExternalLink size={15} />
            Open Test
          </button>
        </div>
        <button className="text-sm text-primary hover:underline flex items-center gap-1.5">
          <ExternalLink size={13} />
          Test on a sandbox page →
        </button>
      </div>

      {/* ── Step 4: Verify ────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-md p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-on text-xs font-bold flex-shrink-0">4</div>
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
                : 'Make sure the script is pasted correctly on your website.'}
            </p>
            <a href="/logs" className="text-xs text-primary hover:underline mt-1 inline-block">
              View in Chat Logs →
            </a>
          </div>
        </div>
      </div>

      {/* ── FAQ Accordion ─────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-md p-5">
        <h3 className="text-h4 text-text-primary mb-2">Common Questions</h3>
        {FAQ_ITEMS.map((item) => <FaqItem key={item.q} {...item} />)}
      </div>

      {/* Regenerate Key Modal */}
      <ConfirmModal
        open={regenOpen}
        onClose={() => !isRegenerating && setRegenOpen(false)}
        onConfirm={handleRegenerate}
        title="Regenerate API Key?"
        description="This will invalidate your current key immediately. Any website using the old key will stop working until you update the embed code."
        confirmLabel={isRegenerating ? 'Regenerating...' : 'Yes, Regenerate'}
        confirmDanger
        disabled={isRegenerating}
      />
    </div>
  );
}
