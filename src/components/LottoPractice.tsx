import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, AlertCircle, Sparkles, RotateCcw, ChevronRight, HelpCircle } from 'lucide-react';
import { LOTTO_SETS } from '../data/lottoTasks';
import { sound } from '../utils/sound';
import { MistakeRecord } from '../types';

interface LottoPracticeProps {
  onAddXp: (amount: number) => void;
  onIncrementStreak: () => void;
  onResetStreak: () => void;
  onRecordMistake: (mistake: MistakeRecord) => void;
}

export const LottoPractice: React.FC<LottoPracticeProps> = ({
  onAddXp,
  onIncrementStreak,
  onResetStreak,
  onRecordMistake,
}) => {
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [expandedExplanationId, setExpandedExplanationId] = useState<number | null>(null);

  const currentSet = LOTTO_SETS[activeSetIndex];
  const requiredCount = 5;

  const handleToggle = (id: number) => {
    if (isChecked) return;
    sound.playClick();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length < requiredCount) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleCheck = () => {
    if (selectedIds.length !== requiredCount) return;

    setIsChecked(true);

    // Calculate score
    const errorIds = currentSet.items.filter((item) => item.isError).map((item) => item.id);
    const correctHits = selectedIds.filter((id) => errorIds.includes(id)).length;

    // Record mistakes for any error words missed or non-errors falsely flagged
    currentSet.items.forEach((item) => {
      const isSelected = selectedIds.includes(item.id);
      if (item.isError && !isSelected) {
        // Missed error
        onRecordMistake({
          id: `lotto-${currentSet.id}-${item.id}-${Date.now()}`,
          type: '5/15 Lottó – Fel nem ismert hiba',
          questionTitle: `Hibás szó a listában: ${item.word}`,
          yourAnswer: 'Helyesnek gondoltad (nem jelölted meg)',
          correctAnswer: item.correction || item.word,
          ruleExplanation: item.ruleExplanation,
          timestamp: Date.now(),
        });
      } else if (!item.isError && isSelected) {
        // Falsely flagged correct word
        onRecordMistake({
          id: `lotto-${currentSet.id}-${item.id}-${Date.now()}`,
          type: '5/15 Lottó – Helyes szót jelöltél hibásnak',
          questionTitle: `Valójában helyes szó: ${item.word}`,
          yourAnswer: 'Hibásnak jelölted meg',
          correctAnswer: item.word,
          ruleExplanation: item.ruleExplanation,
          timestamp: Date.now(),
        });
      }
    });

    if (correctHits >= 4) {
      sound.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onAddXp(correctHits === 5 ? 100 : 70);
      onIncrementStreak();
    } else if (correctHits >= 2) {
      sound.playCorrect();
      onAddXp(correctHits * 12);
      onIncrementStreak();
    } else {
      sound.playWrong();
      onResetStreak();
    }
  };

  const handleReset = () => {
    setSelectedIds([]);
    setIsChecked(false);
    setExpandedExplanationId(null);
  };

  const handleSelectSet = (idx: number) => {
    setActiveSetIndex(idx);
    setSelectedIds([]);
    setIsChecked(false);
    setExpandedExplanationId(null);
  };

  const errorIds = currentSet.items.filter((item) => item.isError).map((item) => item.id);
  const correctHits = selectedIds.filter((id) => errorIds.includes(id)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Set Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎫</span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              5 a 15-ből Felvételi Lottó
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            A központi felvételi leggyakoribb feladattípusa: 15 szóból pontosan 5 szó helyesírása hibás. Keresd meg és húzd be őket!
          </p>
        </div>

        {/* Set selector buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
          {LOTTO_SETS.map((set, idx) => (
            <button
              key={set.id}
              onClick={() => handleSelectSet(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSetIndex === idx
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {idx + 1}. Szelvény
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Lottery Ticket Component */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Ticket Header styled like an authentic Hungarian lottery slip */}
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-500/10 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              SZERENCSE HELYESÍRÁS · {currentSet.title}
            </span>
            <h3 className="text-sm font-semibold text-slate-200 mt-0.5">
              Jelölj meg pontosan {requiredCount} hibás szót!
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Counter Badge */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                selectedIds.length === requiredCount
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {selectedIds.length} / {requiredCount} megjelölve
            </div>

            {/* Quick action buttons */}
            {isChecked ? (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Újrapróbálom
              </button>
            ) : (
              <button
                onClick={handleCheck}
                disabled={selectedIds.length !== requiredCount}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  selectedIds.length === requiredCount
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 cursor-pointer scale-102'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Szelvény leadása ({selectedIds.length}/{requiredCount})
              </button>
            )}
          </div>
        </div>

        {/* 15-Item Word Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentSet.items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isActuallyError = item.isError;

            // Status styling after check
            let borderStyle = 'border-slate-800 hover:border-slate-700 bg-slate-900/60';
            let badgeEl = null;

            if (isChecked) {
              if (isSelected && isActuallyError) {
                // Correctly caught error
                borderStyle = 'border-emerald-500/70 bg-emerald-950/20 shadow-emerald-500/10 shadow-lg';
                badgeEl = (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Eltaláltad!
                  </span>
                );
              } else if (isSelected && !isActuallyError) {
                // Wrongly flagged good word
                borderStyle = 'border-rose-500/70 bg-rose-950/20';
                badgeEl = (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
                    <XCircle className="w-3.5 h-3.5" /> Ez helyes volt!
                  </span>
                );
              } else if (!isSelected && isActuallyError) {
                // Missed error
                borderStyle = 'border-amber-500/70 bg-amber-950/20';
                badgeEl = (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" /> Elmulasztott hiba
                  </span>
                );
              } else {
                borderStyle = 'border-slate-800/60 opacity-60 bg-slate-950/40';
              }
            } else if (isSelected) {
              borderStyle = 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/30';
            }

            return (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${borderStyle}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Number Box like lottery ball */}
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.id}
                    </span>
                    <span className="font-semibold text-slate-100 text-base tracking-wide">
                      {item.word}
                    </span>
                  </div>

                  {/* Lottery checkbox tick */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'border-slate-700 bg-slate-800/40'
                    }`}
                  >
                    {isSelected && <span className="text-xs font-black">✕</span>}
                  </div>
                </div>

                {/* Feedback badge & explanation trigger */}
                {isChecked && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <div>{badgeEl}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedExplanationId(
                          expandedExplanationId === item.id ? null : item.id
                        );
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5"
                    >
                      <span>Szabály</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Inline rule dropdown when expanded */}
                {isChecked && expandedExplanationId === item.id && (
                  <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 space-y-1">
                    {item.correction && (
                      <p className="font-bold text-emerald-400">
                        Helyesen: „{item.correction}”
                      </p>
                    )}
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {item.ruleExplanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Results Banner when checked */}
        {isChecked && (
          <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                  correctHits === 5
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : correctHits >= 3
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {correctHits}/5
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  {correctHits === 5
                    ? '🏆 Telitalálatos szelvény! (5/5 találat)'
                    : correctHits >= 3
                    ? `👍 Szép eredmény! (${correctHits}/5 találat)`
                    : `Gyakoroljunk még! (${correctHits}/5 találat)`}
                </h4>
                <p className="text-xs text-slate-400">
                  {correctHits === 5
                    ? 'Minden elrejtett hibát felismertél a felvételi lottón! +100 XP'
                    : 'Kattints a kártyákon a „Szabály” gombra a pontos magyarázatokért!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Újra ezzel a szelvénnyel
              </button>
              {activeSetIndex < LOTTO_SETS.length - 1 && (
                <button
                  onClick={() => handleSelectSet(activeSetIndex + 1)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
                >
                  Következő szelvényre ➔
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick rule tip box */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200">Felvételi Lottó Tipp:</span>{' '}
          A vizsgán a 15 szóból tipikusan 1 j/ly tévesztés (pl. papagály/fürj), 1-2 kettőzött mássalhangzó hiba (pl. lessz, kissebb, szallag), 1 igeragozási hasonulás (játszuk/higyjél), és 1 magánhangzó-hosszúság vagy tulajdonnévi csapda (kúltúra, Kosuth) szerepel.
        </div>
      </div>
    </div>
  );
};
