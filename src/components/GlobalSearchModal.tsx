import React, { useState, useEffect } from 'react';
import { Search, X, User, Phone, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { Lead } from '../types';
import { STAGE_CONFIG } from '../data/stageMetadata';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, leads, onSelectLead }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = leads.filter(
    (l) =>
      l.studentName.toLowerCase().includes(query.toLowerCase()) ||
      l.phone.includes(query) ||
      l.courseInterest.toLowerCase().includes(query.toLowerCase()) ||
      l.assignedCounselor.toLowerCase().includes(query.toLowerCase()) ||
      l.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-950/60">
          <Search className="w-5 h-5 text-indigo-500 shrink-0 ml-2" />
          <input
            type="text"
            autoFocus
            placeholder="Search leads by student name, phone, course, counselor... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No leads matching "{query}"
            </div>
          ) : (
            filtered.map((lead) => {
              const stageMeta = STAGE_CONFIG[lead.stage];
              return (
                <div
                  key={lead.id}
                  onClick={() => {
                    onSelectLead(lead);
                    onClose();
                  }}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-200 dark:border-indigo-800 shrink-0">
                      {lead.studentName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {lead.studentName}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">({lead.id})</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${stageMeta.badgeBg}`}>
                          {stageMeta.emoji} {lead.stage}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 truncate">
                          <BookOpen className="w-3 h-3 text-indigo-400" />
                          {lead.courseInterest}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {lead.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400 group-hover:text-indigo-500 font-medium hidden sm:inline">
                      View details
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
