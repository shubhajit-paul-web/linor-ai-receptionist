import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bot, MessageSquare, Download, Clock, Calendar,
  Filter, Copy, Smile, Frown, Meh, Globe, Smartphone, FileText, Check, Code,
  Maximize, Minimize
} from 'lucide-react';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { formatDate, formatTime, cn, copyToClipboard } from '../lib/utils';
import { RICH_CHAT_SESSIONS, computeLogStats } from '../lib/chatLogsData';

// ─── Sub-Components ───────────────────────────────────────────────────────────

const SentimentIcon = ({ sentiment, className }) => {
  switch (sentiment) {
    case 'positive': return <Smile className={cn("text-success", className)} />;
    case 'negative': return <Frown className={cn("text-danger", className)} />;
    default: return <Meh className={cn("text-warning", className)} />;
  }
};

const SourceIcon = ({ source, className }) => {
  if (source?.toLowerCase().includes('mobile')) return <Smartphone className={className} />;
  if (source?.toLowerCase().includes('embed')) return <Code className={className} />;
  return <Globe className={className} />;
};

function StatCard({ label, value, subtext, trend, trendUp }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
      <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</span>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-text-primary">{value}</span>
        {trend && (
          <span className={cn("text-xs font-medium", trendUp ? "text-success" : "text-danger")}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      {subtext && <span className="text-xs text-text-muted mt-1">{subtext}</span>}
    </div>
  );
}

function ChatBubble({ role, text, time }) {
  const isUser = role === 'user';
  const isSystem = role === 'system';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-6">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-secondary border border-border shadow-sm">
          <FileText size={12} className="text-text-muted" />
          <span className="text-xs text-text-muted font-medium tracking-wide">
            {text}
          </span>
          <span className="text-[10px] text-text-muted opacity-60 ml-2">{formatTime(time)}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3 mb-6 group', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
          <Bot size={16} className="text-primary" />
        </div>
      )}

      <div className={cn('max-w-[75%] flex flex-col', isUser ? 'items-end' : 'items-start')}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[11px] font-medium text-text-muted">
            {isUser ? 'Patient' : 'AI Assistant'}
          </span>
          <span className="text-[10px] text-text-muted opacity-70">
            {time ? formatTime(time) : ''}
          </span>
        </div>

        <div className="relative group/bubble">
          <div className={cn(
            'px-4 py-3 text-[14px] leading-relaxed shadow-sm transition-all',
            isUser
              ? 'bg-primary text-primary-on rounded-2xl rounded-tr-sm'
              : 'bg-surface border border-border text-text-primary rounded-2xl rounded-tl-sm'
          )}>
            {text}
          </div>

          {/* Quick Copy Action */}
          <button
            onClick={handleCopy}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-surface border border-border text-text-muted opacity-0 group-hover/bubble:opacity-100 transition-all hover:text-primary hover:border-primary/30 shadow-sm",
              isUser ? "-left-10" : "-right-10"
            )}
            title="Copy message"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Chat Logs Page ───────────────────────────────────────────────────────────

export default function ChatLogs() {
  // Using our rich mock data
  const [sessions] = useState(RICH_CHAT_SESSIONS);
  const [activeId, setActiveId] = useState(RICH_CHAT_SESSIONS[0]?.id || null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Handle escape key and body scroll lock for full screen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen]);

  // Filters
  const [search, setSearch] = useState('');
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('All');
  const [sentimentFilter, setSentimentFilter] = useState('All');

  const stats = useMemo(() => computeLogStats(sessions), [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchSearch = !search
        || s.id.toLowerCase().includes(search.toLowerCase())
        || s.preview.toLowerCase().includes(search.toLowerCase())
        || s.transcript.some(m => m.text.toLowerCase().includes(search.toLowerCase()));

      const matchOutcome = outcomeFilter === 'All' || s.outcome === outcomeFilter;
      const matchSentiment = sentimentFilter === 'All' || s.sentiment === sentimentFilter.toLowerCase();

      return matchSearch && matchOutcome && matchSentiment;
    });
  }, [sessions, search, outcomeFilter, sentimentFilter]);

  const activeSession = useMemo(() =>
    sessions.find((s) => s.id === activeId) || null
    , [sessions, activeId]);

  // Keyboard navigation for list
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!filteredSessions.length) return;
      const currentIndex = filteredSessions.findIndex(s => s.id === activeId);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIndex < filteredSessions.length - 1) {
          setActiveId(filteredSessions[currentIndex + 1].id);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) {
          setActiveId(filteredSessions[currentIndex - 1].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredSessions, activeId]);

  const handleExport = () => {
    if (!activeSession) return;
    const data = JSON.stringify(activeSession, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${activeSession.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto h-full">
      {/* ── Top Stats Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Sessions"
          value={stats.total}
          trend="12%" trendUp={true}
          subtext="Last 30 days"
        />
        <StatCard
          label="Resolution Rate"
          value={`${stats.resolution}%`}
          trend="2.4%" trendUp={true}
          subtext="Resolved without human"
        />
        <StatCard
          label="Avg. Session Time"
          value={`${stats.avgDur}m`}
          trend="0.5m" trendUp={false}
          subtext="Time to resolution"
        />
        <StatCard
          label="Positive Sentiment"
          value={`${stats.positivePct}%`}
          trend="5%" trendUp={true}
          subtext="Based on AI analysis"
        />
      </div>

      {/* ── Main Workspace ──────────────────────────────────────── */}
      <motion.div 
        layout
        className={cn(
          "flex gap-0 bg-surface overflow-hidden",
          isFullScreen 
            ? "fixed inset-0 z-[100] m-0 rounded-none border-0"
            : "border border-border rounded-xl shadow-sm relative"
        )} 
        style={
          isFullScreen 
            ? { height: '100vh', width: '100vw' }
            : { height: 'calc(100vh - 240px)', minHeight: '600px' }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >

        {/* ── Left Panel: List & Filters ────────────────────────── */}
        <motion.div 
          layout
          className={cn(
            "flex-shrink-0 border-r border-border flex flex-col bg-surface/50",
            isFullScreen ? "w-[420px]" : "w-[380px]"
          )}
        >

          {/* Header & Global Filters */}
          <div className="p-4 border-b border-border bg-surface z-10 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <MessageSquare size={16} className="text-primary" />
                Conversations
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-text-muted bg-surface-secondary px-2 py-0.5 rounded-full border border-border">
                  {filteredSessions.length} total
                </span>
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
                  title={isFullScreen ? "Exit Full Screen (Esc)" : "Full Screen"}
                >
                  {isFullScreen ? <Minimize size={14} /> : <Maximize size={14} />}
                </button>
              </div>
            </div>

            <div className="relative group">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sessions or transcripts..."
                className="w-full h-9 pl-9 pr-3 text-sm border border-border rounded-lg bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="flex-1 h-8 px-2 text-xs font-medium border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M3%204.5l3%203%203-3%22%20stroke%3D%22%236b6375%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:calc(100%-8px)_center] pr-6"
              >
                <option value="All">All Outcomes</option>
                <option value="Booked">Booked</option>
                <option value="FAQ Only">FAQ Only</option>
                <option value="Unresolved">Unresolved</option>
              </select>

              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="flex-1 h-8 px-2 text-xs font-medium border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M3%204.5l3%203%203-3%22%20stroke%3D%22%236b6375%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:calc(100%-8px)_center] pr-6"
              >
                <option value="All">All Sentiments</option>
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredSessions.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <EmptyState
                    icon={Filter}
                    title="No sessions found"
                    description="Try adjusting your filters or search terms."
                  />
                </motion.div>
              ) : (
                filteredSessions.map((session) => (
                  <motion.button
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={session.id}
                    onClick={() => setActiveId(session.id)}
                    className={cn(
                      'w-full text-left p-4 border-b border-border transition-all duration-150 relative group',
                      activeId === session.id
                        ? 'bg-primary/5 border-l-2 border-l-primary shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]'
                        : 'hover:bg-surface-secondary border-l-2 border-l-transparent'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={session.outcome} className="scale-90 origin-left" />
                        <span className="text-[11px] text-text-muted flex items-center gap-1">
                          <Clock size={10} /> {session.duration}m
                        </span>
                      </div>
                      <span className="text-[11px] text-text-muted font-medium">
                        {formatDate(session.date)}
                      </span>
                    </div>

                    <p className={cn(
                      "text-sm font-medium truncate mb-2 transition-colors",
                      activeId === session.id ? "text-primary" : "text-text-primary group-hover:text-primary/80"
                    )}>
                      "{session.preview}"
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-text-muted bg-surface border border-border px-1.5 py-0.5 rounded">
                          <SourceIcon source={session.source} size={10} />
                          {session.source}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-text-muted">
                          <SentimentIcon sentiment={session.sentiment} size={12} />
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-text-muted bg-surface-secondary px-1.5 py-0.5 rounded">
                        {session.messages} msgs
                      </span>
                    </div>
                  </motion.button>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Right Panel: Transcript Area ────────────────────────── */}
        <motion.div layout className="flex-1 flex flex-col relative bg-[#f8f9fa] dark:bg-[#121319]">
          {!activeSession ? (
            <div className="flex-1 flex items-center justify-center bg-surface">
              <EmptyState
                icon={MessageSquare}
                title="Select a conversation"
                description="Choose a session from the list to view the full transcript and analytics."
              />
            </div>
          ) : (
            <>
              {/* Top Meta Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-surface border-b border-border shadow-sm z-10 flex-shrink-0">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                      Session <code className="text-xs bg-surface-secondary px-1.5 py-0.5 rounded border border-border text-primary">{activeSession.id}</code>
                    </h3>
                    <StatusBadge status={activeSession.outcome} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} /> {formatDate(activeSession.date)} at {formatTime(activeSession.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} /> {activeSession.duration} minutes
                    </span>
                    <span className="flex items-center gap-1.5 capitalize">
                      <SentimentIcon sentiment={activeSession.sentiment} size={12} /> {activeSession.sentiment}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative group/search hidden md:block mr-2">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      value={transcriptSearch}
                      onChange={(e) => setTranscriptSearch(e.target.value)}
                      placeholder="Find in transcript..."
                      className="w-48 h-8 pl-8 pr-3 text-xs border border-border rounded-md bg-surface-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-text-secondary bg-surface border border-border rounded-md hover:bg-surface-secondary hover:text-text-primary transition-colors shadow-sm"
                  >
                    <Download size={14} />
                    Export
                  </button>
                </div>
              </div>

              {/* Tags / Intents Bar */}
              {activeSession.intents && activeSession.intents.length > 0 && (
                <div className="px-6 py-2 bg-surface/80 border-b border-border flex items-center gap-2 flex-shrink-0 backdrop-blur-sm">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Detected Intents:</span>
                  <div className="flex gap-1.5">
                    {activeSession.intents.map(intent => (
                      <span key={intent} className="text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full capitalize">
                        {intent}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcript Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
                <div className="max-w-3xl mx-auto">
                  {/* Start of conversation marker */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px bg-border flex-1"></div>
                    <span className="text-xs font-medium text-text-muted uppercase tracking-wider bg-surface-secondary px-3 py-1 rounded-full border border-border">
                      Conversation Started
                    </span>
                    <div className="h-px bg-border flex-1"></div>
                  </div>

                  {activeSession.transcript.map((msg, i) => {
                    // Simple highlighting logic
                    let displayText = msg.text;
                    if (transcriptSearch && msg.role !== 'system') {
                      const regex = new RegExp(`(${transcriptSearch})`, 'gi');
                      const parts = msg.text.split(regex);
                      displayText = parts.map((part, index) =>
                        regex.test(part) ? <mark key={index} className="bg-warning/30 text-text-primary rounded-sm px-0.5">{part}</mark> : part
                      );
                    }

                    return (
                      <ChatBubble
                        key={i}
                        role={msg.role}
                        text={displayText}
                        time={msg.time}
                      />
                    );
                  })}

                  {/* End of conversation marker */}
                  <div className="flex items-center justify-center gap-4 mt-8 pt-4 pb-12">
                    <div className="h-px bg-border flex-1"></div>
                    <span className="text-xs font-medium text-text-muted bg-surface-secondary px-3 py-1 rounded-full border border-border">
                      Session Ended
                    </span>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="px-6 py-3 bg-surface border-t border-border flex items-center justify-between text-xs text-text-muted flex-shrink-0 z-10">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Bot size={12} /> Model: GPT-4o
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} /> Avg Response: {activeSession.responseTimeAvg}s
                  </span>
                </div>
                <div>
                  ID: <span className="font-mono text-[10px]">{activeSession.id}</span>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
