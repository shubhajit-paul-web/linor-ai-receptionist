import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, Calendar, HelpCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useUIStore from '../../store/useUIStore';
import useClinicStore from '../../store/useClinicStore';
import { cn, truncate } from '../../lib/utils';
import { useDebounce } from '../../hooks/useDebounce';

/** Flatten searchable items from all data sources */
function buildSearchIndex(appointments, faqs) {
  const results = [
    // Pages
    { type: 'page', label: 'Dashboard',       path: '/dashboard',       icon: Calendar  },
    { type: 'page', label: 'Appointments',     path: '/appointments',    icon: Calendar  },
    { type: 'page', label: 'Chat Logs',        path: '/logs',            icon: Search    },
    { type: 'page', label: 'FAQs',            path: '/faqs',            icon: HelpCircle },
    { type: 'page', label: 'Widget Settings', path: '/widget-settings', icon: Settings  },
    { type: 'page', label: 'Embed Code',       path: '/embed',           icon: Settings  },
    { type: 'page', label: 'Clinic Settings', path: '/settings',        icon: Settings  },
    { type: 'page', label: 'API & Security',  path: '/api-security',    icon: Settings  },
    // FAQs
    ...faqs.map((f) => ({
      type:    'faq',
      label:   f.question,
      path:    '/faqs',
      preview: f.answer,
      icon:    HelpCircle,
    })),
    // Appointments
    ...appointments.slice(0, 10).map((a) => ({
      type:    'appointment',
      label:   a.patient,
      path:    '/appointments',
      preview: `${a.service} — ${a.status}`,
      icon:    Calendar,
    })),
  ];
  return results;
}

export function GlobalSearch() {
  const { searchOpen, searchQuery, recentSearches, closeSearch, setSearchQuery, addRecentSearch } = useUIStore();
  const { appointments, faqs } = useClinicStore();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [cursor, setCursor] = useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const index = useMemo(() => buildSearchIndex(appointments, faqs), [appointments, faqs]);

  const filtered = useMemo(() => {
    const query = debouncedSearchQuery.trim();
    if (!query) return [];
    
    return index.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.preview?.toLowerCase().includes(query.toLowerCase())
    );
  }, [debouncedSearchQuery, index]);

  // Group results by type
  const grouped = useMemo(() => {
    return filtered.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {});
  }, [filtered]);

  const flat = useMemo(() => Object.values(grouped).flat(), [grouped]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setCursor(0);
    }
  }, [searchOpen]);

  const handleSelect = (item) => {
    addRecentSearch(item.label);
    closeSearch();
    navigate(item.path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter' && flat[cursor]) {
      handleSelect(flat[cursor]);
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  };

  const TYPE_LABELS = { page: 'Pages', faq: 'FAQs', appointment: 'Appointments' };

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeSearch}
            className="absolute inset-0 bg-black/45 backdrop-blur-[4px] pointer-events-auto"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-lg z-10 pointer-events-auto"
          >
            <div className="bg-surface border border-border rounded-lg shadow-md overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={18} className="text-text-muted flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCursor(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search appointments, FAQs, settings..."
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
                <kbd className="text-xs text-text-muted bg-surface-secondary px-2 py-1 rounded font-mono">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto py-2">
                {searchQuery && flat.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-text-muted">
                    No results for "<strong>{searchQuery}</strong>"
                  </div>
                )}

                {searchQuery && Object.entries(grouped).map(([type, items]) => (
                  <div key={type}>
                    <div className="px-4 py-1.5">
                      <span className="text-label uppercase text-text-muted">{TYPE_LABELS[type] ?? type}</span>
                    </div>
                    {items.map((item) => {
                      const globalIdx = flat.indexOf(item);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label + item.path}
                          onClick={() => handleSelect(item)}
                          className={cn(
                            'w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors duration-75',
                            cursor === globalIdx
                              ? 'bg-primary-light text-primary'
                              : 'hover:bg-surface-secondary text-text-secondary'
                          )}
                        >
                          <Icon size={16} className="flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium">{item.label}</div>
                            {item.preview && (
                              <div className="text-xs text-text-muted mt-0.5">{truncate(item.preview, 60)}</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}

                {/* Recent searches when no query */}
                {!searchQuery && recentSearches.length > 0 && (
                  <div>
                    <div className="px-4 py-1.5">
                      <span className="text-label uppercase text-text-muted">Recent</span>
                    </div>
                    {recentSearches.map((r) => (
                      <button
                        key={r}
                        onClick={() => setSearchQuery(r)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-secondary text-text-secondary transition-colors"
                      >
                        <Clock size={14} className="text-text-muted" />
                        <span className="text-sm">{r}</span>
                      </button>
                    ))}
                  </div>
                )}

                {!searchQuery && recentSearches.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-text-muted">
                    Start typing to search across your dashboard
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
