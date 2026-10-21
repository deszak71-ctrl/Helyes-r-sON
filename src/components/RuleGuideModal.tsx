import React, { useState } from 'react';
import { X, Search, BookOpen, Check, AlertTriangle, Lightbulb } from 'lucide-react';
import { RULE_GUIDES } from '../data/ruleGuide';

interface RuleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RuleGuideModal: React.FC<RuleGuideModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredRules = RULE_GUIDES.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Felvételi Helyesírási Kisokos
              </h3>
              <p className="text-xs text-slate-400">
                A 8. osztályos központi vizsga legfontosabb aranyszabályai és trükkjei
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keress szabályra (pl. j/ly, -d végű ige, kisebb, kötőjel)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Scrollable list of rules */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {filteredRules.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8">
              Nincs a keresésnek megfelelő szabály.
            </p>
          ) : (
            filteredRules.map((rule) => (
              <div
                key={rule.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {rule.badge}
                  </span>
                  <h4 className="font-extrabold text-white text-sm sm:text-base flex-1">
                    {rule.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rule.summary}
                </p>

                {/* Good vs Bad Examples */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                      <Check className="w-3 h-3" /> Helyes példák:
                    </span>
                    <ul className="space-y-0.5 text-[11px] text-slate-200">
                      {rule.examplesGood.map((ex, i) => (
                        <li key={i}>• {ex}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 space-y-1">
                    <span className="text-[10px] font-bold text-rose-400 uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Gyakori hibák (kerüld!):
                    </span>
                    <ul className="space-y-0.5 text-[11px] text-slate-300">
                      {rule.examplesBad.map((ex, i) => (
                        <li key={i}>✗ {ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mnemonic pill */}
                <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px]">{rule.mnemonic}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
