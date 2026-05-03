import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Bot, MessageCircle, Send, X, Mic, Volume2, Monitor, Smartphone, Sparkles, Wifi, WifiOff } from 'lucide-react';
import useClinicStore from '../store/useClinicStore';
import { useToast } from '../components/shared/Toast';
import { widgetSchema } from '../lib/validators';
import { PRESET_COLORS } from '../lib/mockData';
import { cn } from '../lib/utils';

// ─── Skeleton ────────────────────────────────────────────────────────────────────

function SkeletonBlock({ className }) {
  return <div className={cn('skeleton rounded-md', className)} />;
}

function SkeletonSettingsPanel() {
  return (
    <div className="space-y-4">
      {/* Section tabs skeleton */}
      <div className="flex gap-1 bg-surface-secondary p-1 rounded-sm border border-border w-fit">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-8 w-24 rounded-sm" />
        ))}
      </div>
      {/* Settings card skeleton */}
      <div className="bg-surface border border-border rounded-md p-4 md:p-5 space-y-5">
        {/* Text field */}
        <div className="space-y-1.5">
          <SkeletonBlock className="h-2.5 w-16" />
          <SkeletonBlock className="h-10 w-full" />
        </div>
        {/* Color swatches */}
        <div className="space-y-2">
          <SkeletonBlock className="h-2.5 w-24" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-8 w-8 rounded-md" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-8 w-10 rounded-md" />
            <SkeletonBlock className="h-8 w-28 rounded-md" />
          </div>
        </div>
        {/* Position radio */}
        <div className="space-y-2">
          <SkeletonBlock className="h-2.5 w-36" />
          <div className="flex gap-2">
            <SkeletonBlock className="h-12 flex-1 rounded-md" />
            <SkeletonBlock className="h-12 flex-1 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonPreviewStudio() {
  return (
    <div className="flex flex-col gap-3 sticky top-6 h-fit">
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SkeletonBlock className="h-3.5 w-3.5 flex-shrink-0" />
            <SkeletonBlock className="h-3.5 w-44" />
          </div>
          <SkeletonBlock className="h-2.5 w-64 mt-1" />
        </div>
        {/* Viewport control */}
        <div className="space-y-1.5">
          <SkeletonBlock className="h-2 w-16" />
          <div className="flex gap-1">
            <SkeletonBlock className="h-8 flex-1 rounded-sm" />
            <SkeletonBlock className="h-8 flex-1 rounded-sm" />
          </div>
        </div>
        {/* Widget state control */}
        <div className="space-y-1.5">
          <SkeletonBlock className="h-2 w-20" />
          <div className="flex gap-1">
            <SkeletonBlock className="h-8 flex-1 rounded-sm" />
            <SkeletonBlock className="h-8 flex-1 rounded-sm" />
            <SkeletonBlock className="h-8 flex-1 rounded-sm" />
          </div>
        </div>
        {/* Widget shell placeholder */}
        <div className="flex justify-center">
          <SkeletonBlock className="h-[520px] w-[360px] rounded-xl" />
        </div>
        <SkeletonBlock className="h-2.5 w-36 mx-auto" />
      </div>
    </div>
  );
}

// ─── Widget Preview ──────────────────────────────────────────────────────────────

function WidgetPreview({ settings, mode, viewport }) {
  const safeBotName = settings.botName?.trim() || 'Assistant';
  const safeWelcomeMessage = settings.welcomeMessage?.trim() || 'Hi! How can I help today?';
  const safePlaceholder = settings.placeholderText?.trim() || 'Type a message...';
  const safeOfflineMessage =
    settings.offlineMessage?.trim() ||
    "We're currently closed. Please leave a message and we'll get back shortly.";
  const parsedDelay = Number(settings.autoOpenDelay);
  const safeDelay = Number.isFinite(parsedDelay) ? Math.max(0, Math.min(60, parsedDelay)) : 0;
  const parsedColor = settings.color?.trim();
  const accentColor = /^#([0-9A-F]{3}){1,2}$/i.test(parsedColor || '') ? parsedColor : '#1A56DB';

  const isClosed = mode === 'closed';
  const isOffline = mode === 'offline';
  const isMobile = viewport === 'mobile';
  const launcherPosition = settings.position === 'bottom-left' ? 'justify-start' : 'justify-end';
  const wrapperPosition = settings.position === 'bottom-left' ? 'items-start' : 'items-end';

  return (
    <div className={cn('relative flex w-full flex-col', wrapperPosition)} style={{ minHeight: isMobile ? 560 : 580 }}>
      <div
        className={cn(
          'preview-widget-shell flex flex-col overflow-hidden',
          isMobile ? 'w-[272px] h-[500px]' : 'w-[360px] h-[520px]'
        )}
      >
        {isClosed ? (
          <div className={cn('flex-1 bg-background flex items-end p-4', launcherPosition)}>
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                className="preview-launcher w-12 h-12 flex items-center justify-center text-white transition-transform hover:scale-[1.02]"
                style={{ background: accentColor }}
              >
                <MessageCircle size={20} />
              </button>
              <span className="text-[10px] text-text-muted">Tap to chat</span>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-surface border-b border-border px-3 py-2.5 flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: accentColor }}
              >
                <Bot size={12} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">{safeBotName}</p>
                <p className="text-[10px] text-text-muted leading-none">AI Receptionist</p>
              </div>

              {settings.showAvailability && (
                <div
                  className={cn(
                    'ml-auto inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-medium',
                    isOffline
                      ? 'border-warning bg-warning-light text-warning'
                      : 'border-success bg-success-light text-success'
                  )}
                >
                  {isOffline ? <WifiOff size={10} /> : <Wifi size={10} />}
                  {isOffline ? 'Offline' : 'Online'}
                </div>
              )}
            </div>

            <div className="flex-1 bg-background p-3 overflow-y-auto space-y-2.5">
              {settings.collectName && !isOffline && (
                <div className="preview-note-chip text-[10px] text-text-secondary">
                  We ask for patient name before booking.
                </div>
              )}

              {settings.voiceOutput && !isOffline && (
                <div className="preview-note-chip text-[10px] text-primary">
                  <Volume2 size={10} />
                  Voice replies enabled
                </div>
              )}

              <div className="flex gap-2 items-start">
                <div
                  className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center"
                  style={{ background: accentColor }}
                >
                  <Bot size={10} className="text-white" />
                </div>
                <div className="preview-message-ai px-2.5 py-2 max-w-[84%]">
                  <p className="text-[11px] text-text-primary leading-relaxed">
                    {isOffline ? safeOfflineMessage : safeWelcomeMessage}
                  </p>
                </div>
              </div>

              {!isOffline && (
                <div className="flex justify-end">
                  <div
                    className="preview-message-user px-2.5 py-2 max-w-[84%]"
                    style={{ background: accentColor }}
                  >
                    <p className="text-[11px] text-white">I'd like to book an appointment</p>
                  </div>
                </div>
              )}

              {settings.showTyping && !isOffline && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-surface-secondary border border-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-pulse [animation-delay:120ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-pulse [animation-delay:240ms]" />
                </div>
              )}
            </div>

            <div className="p-2 border-t border-border bg-surface space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className={cn('preview-input-field flex-1 h-8 px-2.5 flex items-center', isOffline && 'opacity-60')}>
                  <span className="text-[11px] text-text-muted">{safePlaceholder}</span>
                </div>

                {settings.voiceInput && (
                  <button
                    type="button"
                    disabled={isOffline}
                    className="w-8 h-8 rounded-md border border-border bg-surface-secondary text-text-secondary flex items-center justify-center disabled:opacity-50"
                  >
                    <Mic size={12} />
                  </button>
                )}

                <button
                  type="button"
                  disabled={isOffline}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-white disabled:opacity-50"
                  style={{ background: accentColor }}
                >
                  <Send size={12} />
                </button>
              </div>

              {settings.autoOpen && (
                <p className="text-[10px] text-text-muted">Auto-open delay: {safeDelay}s</p>
              )}
            </div>

            {settings.showBranding && (
              <div className="text-center py-1 border-t border-border bg-surface">
                <span className="text-[10px] text-text-muted">Powered by Linor</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-3 w-full flex items-center justify-between text-[11px] text-text-muted">
        <span>Position: {settings.position === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}</span>
        <span>{isMobile ? 'Mobile preview' : 'Desktop preview'}</span>
      </div>
    </div>
  );
}

// ─── Widget Settings Page ──────────────────────────────────────────────────────

const SECTIONS = ['Appearance', 'Behavior', 'Availability', 'Branding'];
const PREVIEW_VIEWPORTS = [
  { key: 'desktop', label: 'Desktop', icon: Monitor },
  { key: 'mobile', label: 'Mobile', icon: Smartphone },
];
const PREVIEW_MODES = [
  { key: 'open', label: 'Open', icon: MessageCircle },
  { key: 'closed', label: 'Closed', icon: X },
  { key: 'offline', label: 'Offline', icon: WifiOff },
];

export default function WidgetSettings() {
  const { widgetSettings, updateWidgetSettings } = useClinicStore();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('Appearance');
  const [previewViewport, setPreviewViewport] = useState('desktop');
  const [previewMode, setPreviewMode] = useState('open');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1300);
    return () => clearTimeout(t);
  }, []);

  const { register, handleSubmit, watch, setValue, reset, formState: { isDirty, isSubmitting } } = useForm({
    resolver: zodResolver(widgetSchema),
    defaultValues: widgetSettings,
  });

  // Live preview — watches all fields
  const liveValues = watch();

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 500));
    updateWidgetSettings(data);
    reset(data);
    toast.success('Widget settings saved!');
  };

  const selectedColor = watch('color');
  const autoOpen      = watch('autoOpen');
  const sectionCardClass = 'bg-surface border border-border rounded-md p-4 md:p-5';

  return (
    <div className="max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-h2 text-text-primary">Widget Settings</h1>
        <p className="text-sm text-text-muted mt-0.5">Customize how your chatbot looks and behaves on your website.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <SkeletonSettingsPanel />
          <SkeletonPreviewStudio />
        </div>
      ) : (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* ── Left: Settings ────────────────────────────────── */}
          <div className="space-y-4">
            {/* Section tabs */}
            <div className="flex gap-1 bg-surface-secondary p-1 rounded-sm border border-border w-fit">
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setActiveSection(s)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-sm transition-all duration-150',
                    activeSection === s
                      ? 'bg-surface text-text-primary shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Appearance section */}
            {activeSection === 'Appearance' && (
              <div className={cn(sectionCardClass, 'space-y-5')}>
                {/* Bot name */}
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Bot Name</label>
                  <input {...register('botName')} className="w-full h-10 px-3 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary" />
                </div>

                {/* Widget Color */}
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-2">Widget Color</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setValue('color', c, { shouldDirty: true })}
                        className={cn(
                          'w-8 h-8 rounded-md transition-all duration-100',
                          selectedColor === c && 'ring-2 ring-offset-2 ring-primary scale-110'
                        )}
                        style={{ background: c }}
                        aria-label={`Set color ${c}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      {...register('color')}
                      className="w-10 h-8 rounded-md border border-border cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => setValue('color', e.target.value, { shouldDirty: true })}
                      className="w-28 h-8 px-2 text-xs border border-border rounded-md font-mono bg-surface"
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-2">Chat Bubble Position</label>
                  <div className="flex gap-2">
                    {['bottom-right', 'bottom-left'].map((pos) => (
                      <label
                        key={pos}
                        className={cn(
                          'flex-1 flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors',
                          watch('position') === pos
                            ? 'border-primary bg-primary-light text-primary'
                            : 'border-border hover:border-border-strong'
                        )}
                      >
                        <input
                          type="radio"
                          {...register('position')}
                          value={pos}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium capitalize">
                          {pos === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Behavior section */}
            {activeSection === 'Behavior' && (
              <div className={cn(sectionCardClass, 'space-y-4')}>
                {/* Welcome message */}
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Welcome Message</label>
                  <textarea {...register('welcomeMessage')} rows={3}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface resize-none focus:outline-none focus:border-primary" />
                </div>

                {/* Placeholder text */}
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Input Placeholder</label>
                  <input {...register('placeholderText')}
                    className="w-full h-10 px-3 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary" />
                </div>

                {/* Toggles */}
                {[
                  { key: 'showTyping',   label: 'Show typing indicator',         desc: 'Pulsing dots while AI is generating' },
                  { key: 'collectName',  label: 'Collect patient name',          desc: 'Ask for name before first message' },
                  { key: 'voiceInput',   label: 'Enable voice input',            desc: 'Microphone button in chat input' },
                  { key: 'voiceOutput',  label: 'Enable voice output',           desc: 'Text-to-speech for AI responses' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{label}</p>
                      <p className="text-xs text-text-muted">{desc}</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" {...register(key)} />
                      <span className="toggle-thumb" />
                    </label>
                  </div>
                ))}

                {/* Auto-open */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Auto-open on page load</p>
                    <p className="text-xs text-text-muted">Widget opens automatically after a delay</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" {...register('autoOpen')} />
                    <span className="toggle-thumb" />
                  </label>
                </div>
                {autoOpen && (
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1.5">
                      Auto-open delay (seconds)
                    </label>
                    <input
                      type="number"
                      {...register('autoOpenDelay', { valueAsNumber: true })}
                      min={0}
                      max={60}
                      className="w-24 h-9 px-3 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Availability section */}
            {activeSection === 'Availability' && (
              <div className={cn(sectionCardClass, 'space-y-4')}>
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Outside Working Hours Message</label>
                  <textarea {...register('offlineMessage')} rows={4}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface resize-none focus:outline-none focus:border-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Show availability badge</p>
                    <p className="text-xs text-text-muted">Display Online/Offline dot on widget</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" {...register('showAvailability')} />
                    <span className="toggle-thumb" />
                  </label>
                </div>
              </div>
            )}

            {/* Branding section */}
            {activeSection === 'Branding' && (
              <div className={cn(sectionCardClass, 'space-y-4')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Show "Powered by Linor" badge</p>
                    <p className="text-xs text-text-muted">Upgrade to Pro to remove branding</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" {...register('showBranding')} />
                    <span className="toggle-thumb" />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Live Preview ───────────────────────────── */}
          <div className="flex flex-col gap-3 sticky top-6 h-fit">
            <div className="preview-studio-card p-5">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  <h3 className="text-h4 text-text-primary">Live Preview Studio</h3>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Adaptive widget simulation with premium UI styling.
                </p>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1.5">Viewport</p>
                  <div className="preview-segmented-control">
                    {PREVIEW_VIEWPORTS.map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPreviewViewport(key)}
                        className={cn(
                          'preview-segmented-btn',
                          previewViewport === key
                            ? 'bg-surface text-text-primary shadow-sm'
                            : 'text-text-muted hover:text-text-primary'
                        )}
                      >
                        <Icon size={12} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1.5">Widget State</p>
                  <div className="preview-segmented-control">
                    {PREVIEW_MODES.map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPreviewMode(key)}
                        className={cn(
                          'preview-segmented-btn capitalize',
                          previewMode === key
                            ? 'bg-surface text-text-primary shadow-sm'
                            : 'text-text-muted hover:text-text-primary'
                        )}
                      >
                        <Icon size={12} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <WidgetPreview settings={liveValues} mode={previewMode} viewport={previewViewport} />
              </div>
              <p className="text-[11px] text-text-muted text-center mt-3">
                Preview only — save to apply live
              </p>
            </div>
          </div>
        </div>

        {/* ── Sticky Save Bar ───────────────────────────────────── */}
        {isDirty && (
          <div className="fixed bottom-0 left-0 right-0 z-20 bg-surface border-t border-border px-6 py-3 flex items-center justify-between shadow-md">
            <p className="text-sm text-text-secondary">You have unsaved changes.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => reset(widgetSettings)}
                className="h-9 px-4 text-sm font-medium border border-border rounded-md hover:bg-surface-secondary text-text-secondary"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-9 px-4 text-sm font-semibold bg-primary text-primary-on rounded-md hover:bg-primary-hover disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting ? <><Loader2 size={14} className="animate-spin" />Saving...</> : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </form>
      )}
    </div>
  );
}
